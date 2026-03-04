import { useDashboard } from '@irdashies/context';
import { LapTimeLogWidgetSettings } from '../../Settings/types';

export const useLapTimeLogSettings = () => {
  const { currentDashboard } = useDashboard();

  const lapTimeLogSettings = currentDashboard?.widgets.find(
    (widget) => widget.id === 'laptimelog'
  )?.config;

  return lapTimeLogSettings as LapTimeLogWidgetSettings['config'];
};
