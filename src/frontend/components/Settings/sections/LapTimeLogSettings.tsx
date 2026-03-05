import { useState, useEffect } from 'react';
import { BaseSettingsSection } from '../components/BaseSettingsSection';
import {
  SessionVisibilitySettings,
  SettingsTabType,
  LapTimeLogWidgetSettings,
} from '../types';
import { useDashboard } from '@irdashies/context';
import { TabButton } from '../components/TabButton';
import { SessionVisibility } from '../components/SessionVisibility';
import { SettingToggleRow } from '../components/SettingToggleRow';
import { SettingsSection } from '../components/SettingSection';
import { SettingSliderRow } from '../components/SettingSliderRow';
import { SettingNumberRow } from '../components/SettingNumberRow';
import { SettingSelectRow } from '../components/SettingSelectRow';

const SETTING_ID = 'laptimelog';

const defaultConfig: LapTimeLogWidgetSettings['config'] = {
  showLabel: true,
  sessionVisibility: {
    race: true,
    loneQualify: true,
    openQualify: true,
    practice: true,
    offlineTesting: true,
  },
  background: { opacity: 80 },
  showOnlyWhenOnTrack: true,
  maxLapsShow: 7,
  timeFormat: 'full',
};

const migrateConfig = (
  savedConfig: unknown
): LapTimeLogWidgetSettings['config'] => {
  if (!savedConfig || typeof savedConfig !== 'object') return defaultConfig;
  const config = savedConfig as Record<string, unknown>;

  return {
    showLabel: (config.showLabel as boolean) ?? defaultConfig.showLabel,
    sessionVisibility:
      (config.sessionVisibility as SessionVisibilitySettings) ??
      defaultConfig.sessionVisibility,
    background: {
      opacity: (config.background as { opacity?: number })?.opacity ?? 0,
    },
    showOnlyWhenOnTrack:
      (config.showOnlyWhenOnTrack as boolean) ??
      defaultConfig.showOnlyWhenOnTrack,
    maxLapsShow: (config.maxLapsShow as number) ?? defaultConfig.maxLapsShow,
    timeFormat:
      (config.timeFormat as
        | 'full'
        | 'mixed'
        | 'minutes'
        | 'seconds-full'
        | 'seconds-mixed'
        | 'seconds') ?? defaultConfig.timeFormat,
  };
};

export const LapTimeLogSettings = () => {
  const { currentDashboard } = useDashboard();

  const savedSettings = currentDashboard?.widgets.find(
    (w) => w.id === SETTING_ID
  ) as LapTimeLogWidgetSettings | undefined;

  const [settings, setSettings] = useState<LapTimeLogWidgetSettings>({
    id: SETTING_ID,
    enabled: savedSettings?.enabled ?? true,
    config: migrateConfig(savedSettings?.config),
  });

  // Tab state with persistence
  const [activeTab, setActiveTab] = useState<SettingsTabType>(
    () =>
      (localStorage.getItem('laptimelogtab') as SettingsTabType) || 'options'
  );

  useEffect(() => {
    localStorage.setItem('laptimelogtab', activeTab);
  }, [activeTab]);

  if (!currentDashboard) return <>Loading...</>;

  return (
    <BaseSettingsSection
      title="LapTime"
      description="Display lap time history"
      settings={settings as LapTimeLogWidgetSettings}
      onSettingsChange={(s) => setSettings(s as LapTimeLogWidgetSettings)}
      widgetId={SETTING_ID}
    >
      {(handleConfigChange) => (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-slate-700/50">
            <TabButton
              id="options"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Options
            </TabButton>
            <TabButton
              id="visibility"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              Visibility
            </TabButton>
          </div>

          <div className="pt-4">
            {/* OPTIONS TAB */}
            {activeTab === 'options' && (
              <SettingsSection title="Display">
                <SettingToggleRow
                  title="Show lap Label"
                  description="Toggle display of the lap name text"
                  enabled={settings.config.showLabel ?? false}
                  onToggle={(enabled) =>
                    handleConfigChange({ showLabel: enabled })
                  }
                />

                <SettingToggleRow
                  title="Show only when on track"
                  description="If enabled, relatives will only be shown when driving"
                  enabled={settings.config.showOnlyWhenOnTrack ?? false}
                  onToggle={(newValue) =>
                    handleConfigChange({ showOnlyWhenOnTrack: newValue })
                  }
                />

                <SettingNumberRow
                  title="Max laps show"
                  description="Max count of laps show in list"
                  min={1}
                  max={10}
                  value={settings.config.maxLapsShow ?? 7}
                  onChange={(value) =>
                    handleConfigChange({ maxLapsShow: value })
                  }
                />
                <SettingSelectRow
                  title="Time format"
                  description="Time format to show"
                  value={settings.config.timeFormat ?? 'full'}
                  options={[
                    { label: '1:42.123', value: 'full' },
                    { label: '1:42.1', value: 'mixed' },
                    { label: '1:42', value: 'minutes' },
                    { label: '42.123', value: 'seconds-full' },
                    { label: '42.1', value: 'seconds-mixed' },
                    { label: '42', value: 'seconds' },
                  ]}
                  onChange={(value) =>
                    handleConfigChange({ timeFormat: value })
                  }
                />
              </SettingsSection>
            )}

            {/* VISIBILITY TAB */}
            {activeTab === 'visibility' && (
              <SettingsSection title="Session Visibility">
                <SessionVisibility
                  sessionVisibility={settings.config.sessionVisibility}
                  handleConfigChange={handleConfigChange}
                />

                <SettingSliderRow
                  title="Background Opacity"
                  value={settings.config.background.opacity ?? 40}
                  units="%"
                  min={0}
                  max={100}
                  step={1}
                  onChange={(v) =>
                    handleConfigChange({ background: { opacity: v } })
                  }
                />
              </SettingsSection>
            )}
          </div>
        </div>
      )}
    </BaseSettingsSection>
  );
};
