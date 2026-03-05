import { useEffect } from 'react';
import {
  useTelemetryValue,
  useTelemetryValues,
} from '../TelemetryStore/TelemetryStore';
import { useLapTimesStore } from './LapTimesStore';
import { useStandingsSettings } from '../../components/Standings/hooks/useStandingsSettings';
import { useLapTimeLogSettings } from '../../components/LapTimeLog/hooks/useLapTimeLog';

/**
 * Hook that automatically updates the LapTimesStore with telemetry data.
 * This ensures lap time history is always up-to-date without manual updates in components.
 *
 * Use this hook in components that need lap time history tracking (e.g., Standings overlay).
 */
export const useLapTimesStoreUpdater = () => {
  const sessionNum = useTelemetryValue('SessionNum');
  const carIdxLastLapTime = useTelemetryValues('CarIdxLastLapTime');
  const updateLapTimes = useLapTimesStore((state) => state.updateLapTimes);

  const standingsSettings = useStandingsSettings();
  const lapTimeLogSettings = useLapTimeLogSettings();

  const updateIsActive =
    standingsSettings?.lapTimeDeltas?.enabled ||
    lapTimeLogSettings !== undefined;

  useEffect(() => {
    if (carIdxLastLapTime && updateIsActive) {
      updateLapTimes(carIdxLastLapTime, sessionNum ?? null);
    }
  }, [updateIsActive, carIdxLastLapTime, sessionNum, updateLapTimes]);
};
