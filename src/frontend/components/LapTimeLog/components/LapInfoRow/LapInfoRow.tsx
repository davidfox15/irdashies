import { memo, useMemo } from 'react';
import { LapNumberCell } from './cells/LapNumberCell';
import { LapTimeCell } from './cells/LapTimeCell';

interface LapInfoRowProps {
  lapTime: string;
  lapNumber: string;
  incs?: number;
}

export const LapInfoRow = memo((props: LapInfoRowProps) => {
  const { lapNumber, lapTime } = props;

  const columnDefinitions = useMemo(() => {
    const columns = [
      {
        id: 'lapNumber',
        shouldRender: true,
        component: <LapNumberCell key="carNumber" lapNumber={lapNumber} />,
      },
      {
        id: 'lapTime',
        shouldRender: true,
        component: <LapTimeCell key="carNumber" lapTimeString={lapTime} />,
      },
    ];

    return columns.filter((col) => col.shouldRender);
  }, [lapNumber, lapTime]);

  return <tr>{columnDefinitions.map((column) => column.component)}</tr>;
});

LapInfoRow.displayName = 'LapInfoRow';
