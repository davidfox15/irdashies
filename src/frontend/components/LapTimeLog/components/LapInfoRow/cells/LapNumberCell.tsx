import { memo } from 'react';

interface LapNumberCellProps {
  lapNumber?: string;
}

export const LapNumberCell = memo(({ lapNumber }: LapNumberCellProps) => (
  <td
    data-column="lapNumber"
    className={`w-auto border-l-4 text-white text-right px-1 whitespace-nowrap`}
  >
    {`#${lapNumber}`}
  </td>
));

LapNumberCell.displayName = 'LapNumberCell';
