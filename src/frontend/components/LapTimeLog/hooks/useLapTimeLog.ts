import { useDashboard } from '@irdashies/context';
import { LapTimeLogWidgetSettings } from '../../Settings/types';

export const useLapTimeLog = () => {
  const { currentDashboard } = useDashboard();

  const sectorsTimeLogSettings = currentDashboard?.widgets.find(
    (widget) => widget.id === 'lapTimeLog'
  )?.config;

  return sectorsTimeLogSettings as LapTimeLogWidgetSettings['config'];
};
