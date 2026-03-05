import { memo, useMemo } from 'react';
import { LapNumberCell } from './cells/LapNumberCell';
import { LapTimeCell, LapTimeState } from './cells/LapTimeCell';
import { LapSectorsCell } from './cells/LapSectorsCell';

interface LapInfoRowProps {
  lapTime: string;
  lapNumber: string;
  lapTimeState?: LapTimeState;
  sectors?: string;
  incs?: number;
}

export const LapInfoRow = memo((props: LapInfoRowProps) => {
  const { lapNumber, lapTime, lapTimeState, sectors } = props;

  const columnDefinitions = useMemo(() => {
    const columns = [
      {
        id: 'lapNumber',
        shouldRender: true,
        component: <LapNumberCell key="lapNumber" lapNumber={lapNumber} />,
      },
      {
        id: 'lapTime',
        shouldRender: true,
        component: (
          <LapTimeCell
            key="lapTime"
            lapTimeString={lapTime}
            lapTimeState={lapTimeState}
          />
        ),
      },
      {
        id: 'sectors',
        shouldRender: !!sectors,
        component: <LapSectorsCell key="sectors" sectors={sectors ?? ''} />,
      },
    ];

    return columns.filter((col) => col.shouldRender);
  }, [lapNumber, lapTime, lapTimeState, sectors]);

  return <tr>{columnDefinitions.map((column) => column.component)}</tr>;
});

LapInfoRow.displayName = 'LapInfoRow';
