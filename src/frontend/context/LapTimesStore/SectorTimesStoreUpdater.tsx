import { useEffect, useMemo, useRef } from 'react';
import {
  useSessionSplitSectors,
  useTelemetryValue,
  useDriverCarIdx,
} from '@irdashies/context';
import { useLapTimesStore } from './LapTimesStore';

const isValidSectorLap = (sectors: number[]) =>
  sectors.length === 3 && sectors.every((value) => value > 0);

export const useSectorTimesStoreUpdater = () => {
  const sessionNum = useTelemetryValue('SessionNum');
  const lap = useTelemetryValue('Lap');
  const lapDistPct = useTelemetryValue('LapDistPct');
  const lapCurrentLapTime = useTelemetryValue('LapCurrentLapTime');
  const lapLastLapTime = useTelemetryValue('LapLastLapTime');
  const driverCarIdx = useDriverCarIdx();
  const sectors = useSessionSplitSectors();
  const addDriverSectorLap = useLapTimesStore(
    (state) => state.addDriverSectorLap
  );

  const sectorStartPcts = useMemo(() => {
    if (!sectors || sectors.length < 3) return [];

    return [...sectors]
      .sort((a, b) => a.SectorNum - b.SectorNum)
      .map((sector) => sector.SectorStartPct)
      .filter((value) => value > 0 && value < 1)
      .slice(0, 2);
  }, [sectors]);

  const prevLapRef = useRef<number | undefined>(undefined);
  const prevLapDistPctRef = useRef<number | undefined>(undefined);
  const sectorCrossTimesRef = useRef<(number | undefined)[]>([]);

  useEffect(() => {
    if (
      driverCarIdx === undefined ||
      lap === undefined ||
      lapDistPct === undefined ||
      lapCurrentLapTime === undefined ||
      sectorStartPcts.length < 2
    ) {
      return;
    }

    const prevLap = prevLapRef.current;
    const prevLapDistPct = prevLapDistPctRef.current;

    if (prevLap === undefined) {
      prevLapRef.current = lap;
      prevLapDistPctRef.current = lapDistPct;
      sectorCrossTimesRef.current = Array(sectorStartPcts.length).fill(
        undefined
      );
      return;
    }

    if (lap > prevLap) {
      const [s1Cross, s2Cross] = sectorCrossTimesRef.current;

      if (
        s1Cross !== undefined &&
        s2Cross !== undefined &&
        lapLastLapTime !== undefined &&
        lapLastLapTime > s2Cross
      ) {
        const sectorLap = [
          s1Cross,
          s2Cross - s1Cross,
          lapLastLapTime - s2Cross,
        ];
        if (isValidSectorLap(sectorLap)) {
          addDriverSectorLap(driverCarIdx, sectorLap, sessionNum ?? null);
        }
      }

      sectorCrossTimesRef.current = Array(sectorStartPcts.length).fill(
        undefined
      );
    }

    if (lap === prevLap && prevLapDistPct !== undefined) {
      sectorStartPcts.forEach((sectorStartPct, index) => {
        if (
          sectorCrossTimesRef.current[index] === undefined &&
          prevLapDistPct < sectorStartPct &&
          lapDistPct >= sectorStartPct
        ) {
          sectorCrossTimesRef.current[index] = lapCurrentLapTime;
        }
      });
    }

    prevLapRef.current = lap;
    prevLapDistPctRef.current = lapDistPct;
  }, [
    addDriverSectorLap,
    driverCarIdx,
    lap,
    lapCurrentLapTime,
    lapDistPct,
    lapLastLapTime,
    sectorStartPcts,
    sessionNum,
  ]);
};
