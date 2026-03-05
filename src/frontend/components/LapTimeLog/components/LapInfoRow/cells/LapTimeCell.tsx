import { memo } from 'react';

export type LapTimeState = 'session-fastest' | 'personal-best' | undefined;

interface LastTimeCellProps {
  lapTimeString: string;
  lapTimeState?: LapTimeState;
}

const getLapTimeColorClass = (state?: LapTimeState): string => {
  if (state === 'session-fastest') return 'text-purple-400';
  if (state === 'personal-best') return 'text-green-400';
  return '';
};

export const LapTimeCell = memo(
  ({ lapTimeString, lapTimeState }: LastTimeCellProps) => (
    <td
      data-column="lapTime"
      className={`w-auto px-2 whitespace-nowrap ${getLapTimeColorClass(lapTimeState)}`}
    >
      {lapTimeString}
    </td>
  )
);

LapTimeCell.displayName = 'LapTimeCell';
