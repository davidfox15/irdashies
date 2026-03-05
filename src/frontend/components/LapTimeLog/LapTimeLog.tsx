import {
  useFocusCarIdx,
  useGeneralSettings,
  useSessionFastestLaps,
  useTelemetryValue,
} from '@irdashies/context';
import { useLapTimeLogSettings } from './hooks/useLapTimeLog';
import { LapInfoRow } from './components/LapInfoRow/LapInfoRow';
import { formatTime } from '@irdashies/utils/time';
import {
  useDriverLapTimeHistory,
  useDriverSectorHistory,
} from '../../context/LapTimesStore/LapTimesStore';
import { useMemo } from 'react';
import { LapTimeState } from './components/LapInfoRow/cells/LapTimeCell';

export const LapTimeLog = () => {
  const settings = useLapTimeLogSettings();
  const generalSettings = useGeneralSettings();
  const driverCarIdx = useFocusCarIdx();

  const driverBestLapTime = useTelemetryValue('LapBestLapTime');
  const isOnTrack = useTelemetryValue('IsOnTrack');
  const sessionNum = useTelemetryValue('SessionNum');

  const driverLapTimeHistory = useDriverLapTimeHistory(driverCarIdx);
  const driverSectorHistory = useDriverSectorHistory(driverCarIdx);
  const fastestLaps = useSessionFastestLaps(sessionNum);

  const fastestLapInSession = useMemo(
    () =>
      fastestLaps?.[0]?.CarIdx === driverCarIdx
        ? fastestLaps?.[0]?.FastestTime
        : undefined,
    [fastestLaps, driverCarIdx]
  );

  if (settings?.showOnlyWhenOnTrack && !isOnTrack) return null;

  const tableBorderSpacing = generalSettings?.compactMode
    ? 'border-spacing-y-0'
    : 'border-spacing-y-0.5';
  const maxLapsToShow = settings?.maxLapsShow ?? 7;
  const lapHistoryReversed = driverLapTimeHistory.toReversed();
  const sectorHistoryReversed = driverSectorHistory.toReversed();

  return (
    <div
      className={`w-full bg-slate-800/(--bg-opacity) rounded-sm ${!generalSettings?.compactMode ? 'p-2' : ''} text-white overflow-hidden`}
      style={{
        ['--bg-opacity' as string]: `${settings?.background?.opacity ?? 0}%`,
      }}
    >
      {settings?.showLabel && (
        <div className="mb-2 rounded-sm bg-slate-900/70 px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-wide">
          Lap Time Log
        </div>
      )}
      {driverBestLapTime && <div>{formatTime(driverBestLapTime, 'full')}</div>}
      <table
        className={`w-full table-auto text-sm border-separate ${tableBorderSpacing}`}
      >
        {driverLapTimeHistory && (
          <tbody>
            {lapHistoryReversed.map((time, index) => {
              if (index >= maxLapsToShow) return null;

              const timeStr = formatTime(time, settings?.timeFormat ?? 'full');
              const sectorLap = sectorHistoryReversed[index];
              const sectors =
                sectorLap && sectorLap.length === 3
                  ? sectorLap
                      .map((sectorTime) =>
                        formatTime(sectorTime, 'seconds-mixed')
                      )
                      .join(' | ')
                  : undefined;

              let lapTimeState: LapTimeState = undefined;
              if (driverBestLapTime === time) lapTimeState = 'personal-best';
              if (fastestLapInSession === time)
                lapTimeState = 'session-fastest';

              return (
                <LapInfoRow
                  key={index}
                  lapNumber={index ? (index + 1).toString() : 'last'}
                  lapTime={timeStr}
                  lapTimeState={lapTimeState}
                  sectors={sectors}
                />
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};
