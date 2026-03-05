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

const SETTING_ID = 'laptimelog';

const defaultConfig: LapTimeLogWidgetSettings['config'] = {
  enabled: true,
  showLabel: true,
  sessionVisibility: {
    race: true,
    loneQualify: true,
    openQualify: true,
    practice: true,
    offlineTesting: true,
  },
  background: { opacity: 0.7 },
};

const migrateConfig = (
  savedConfig: unknown
): LapTimeLogWidgetSettings['config'] => {
  if (!savedConfig || typeof savedConfig !== 'object') return defaultConfig;
  const config = savedConfig as Record<string, unknown>;

  return {
    enabled: (config.enabled as boolean) ?? defaultConfig.enabled,
    showLabel: (config.showLabel as boolean) ?? defaultConfig.showLabel,
    sessionVisibility:
      (config.sessionVisibility as SessionVisibilitySettings) ??
      defaultConfig.sessionVisibility,
    background: {
      opacity: (config.background as { opacity?: number })?.opacity ?? 0,
    },
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
