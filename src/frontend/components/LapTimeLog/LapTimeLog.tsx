import { useFocusCarIdx, useGeneralSettings } from '@irdashies/context';
import { useLapTimeLogSettings } from './hooks/useLapTimeLog';
import { LapInfoRow } from './components/LapInfoRow/LapInfoRow';
import { formatTime } from '@irdashies/utils/time';
import { useDriverLapTimeHistory } from 'src/frontend/context/LapTimesStore/LapTimesStore';

export const LapTimeLog = () => {
  const settings = useLapTimeLogSettings();
  const generalSettings = useGeneralSettings();
  const driverCarIdx = useFocusCarIdx();
  const driverLapTimeHistory = useDriverLapTimeHistory(driverCarIdx);

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
        {driverLapTimeHistory && (
          <tbody>
            {driverLapTimeHistory.map((time, index) => {
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
