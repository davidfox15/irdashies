import { useFocusCarIdx, useGeneralSettings } from '@irdashies/context';
import { useLapTimeLog } from './hooks/useLapTimeLog';
import { LapInfoRow } from './components/LapInfoRow/LapInfoRow';
import { useLapTimeHistory } from '../../context/LapTimesStore/LapTimesStore';
import { useMemo } from 'react';
import { formatTime } from '@irdashies/utils/time';

export const LapTimeLog = () => {
  const settings = useLapTimeLog();
  const generalSettings = useGeneralSettings();
  const driverCarIdx = useFocusCarIdx();
  const lapTimeHistory = useLapTimeHistory();
  const driverLaps = useMemo(() => {
    if (driverCarIdx !== undefined) return lapTimeHistory[driverCarIdx];
    return [];
  }, [driverCarIdx, lapTimeHistory]);

  const tableBorderSpacing = generalSettings?.compactMode
    ? 'border-spacing-y-0'
    : 'border-spacing-y-0.5';

  return (
    <div
      className={`w-full bg-slate-800/(--bg-opacity) rounded-sm ${!generalSettings?.compactMode ? 'p-2' : ''} text-white overflow-hidden`}
      style={{
        ['--bg-opacity' as string]: `${settings?.background?.opacity ?? 0}%`,
      }}
    >
      {(settings?.showLabel ?? true) && (
        <div className="mb-2 rounded-sm bg-slate-900/70 px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-wide">
          Lap Time Log
        </div>
      )}
      <table
        className={`w-full table-auto text-sm border-separate ${tableBorderSpacing}`}
      >
        {driverLaps && (
          <tbody>
            {driverLaps.map((time, index) => {
              // TODO: settigns.timeFormat
              const timeStr = formatTime(time, 'full');
              return (
                <LapInfoRow
                  key={index}
                  lapNumber={index.toString()}
                  lapTime={timeStr}
                />
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};
