import type { Meta, StoryObj } from '@storybook/react-vite';
import { TelemetryDecoratorWithConfig } from '@irdashies/storybook';
import { LapTimeLog } from './LapTimeLog';
import { useLapTimesStoreUpdater } from '../../context/LapTimesStore/LapTimesStoreUpdater';

const LapTimeLogWithUpdater = () => {
  useLapTimesStoreUpdater();

  return (
    <div className="h-[280px] w-[320px]">
      <LapTimeLog />
    </div>
  );
};

const meta: Meta<typeof LapTimeLog> = {
  component: LapTimeLog,
  title: 'widgets/laptimelog',
};

export default meta;

type Story = StoryObj<typeof LapTimeLog>;

const baseConfig = {
  standings: {
    lapTimeDeltas: { enabled: true, numLaps: 3 },
  },
};

export const Primary: Story = {
  decorators: [
    TelemetryDecoratorWithConfig('/test-data/1731637331038', {
      ...baseConfig,
      lapTimeLog: {
        showLabel: true,
        background: { opacity: 70 },
      },
    }),
  ],
  render: () => <LapTimeLogWithUpdater />,
};

export const WithoutLabel: Story = {
  decorators: [
    TelemetryDecoratorWithConfig('/test-data/1731637331038', {
      ...baseConfig,
      lapTimeLog: {
        showLabel: false,
        background: { opacity: 70 },
      },
    }),
  ],
  render: () => <LapTimeLogWithUpdater />,
};

export const TransparentBackground: Story = {
  decorators: [
    TelemetryDecoratorWithConfig('/test-data/1731637331038', {
      ...baseConfig,
      lapTimeLog: {
        showLabel: true,
        background: { opacity: 20 },
      },
    }),
  ],
  render: () => <LapTimeLogWithUpdater />,
};
