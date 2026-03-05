import { memo } from 'react';

interface LapSectorsCellProps {
  sectors: string;
}

export const LapSectorsCell = memo(({ sectors }: LapSectorsCellProps) => (
  <td
    data-column="sectors"
    className="w-auto px-2 whitespace-nowrap text-slate-300"
  >
    {sectors}
  </td>
));

LapSectorsCell.displayName = 'LapSectorsCell';
