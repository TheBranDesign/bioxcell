import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Building2,
  Palette,
  X,
} from 'lucide-react';
import { ScreenHeader } from '../components/UiPrimitives';

interface SettingsScreenProps {
  selectedPlantName: string;
  onBack: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
  onExitToSplash: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  selectedPlantName,
  onBack,
  onShowToast,
  onExitToSplash,
}) => {
  const [criticalPush, setCriticalPush] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [biometricLock, setBiometricLock] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [modal, setModal] = useState<'help' | 'about' | null>(null);

  const toggleSetting = (label: string, next: boolean, setter: (v: boolean) => void) => {
    setter(next);
    onShowToast(`${label} ${next ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader title="Profile & Settings" subtitle="Engineer Preferences" onBack={onBack} />

      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* User Profile Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#13263A] to-[#081525] p-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#20C5E8]/20 text-[#20C5E8] border border-[#20C5E8]/30">
            <User className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-[#F3F7FC]">Alex Mercer</h2>
            <p className="text-[11px] text-[#20C997] font-medium">Senior Plant Operations Engineer</p>
            <p className="text-[10px] text-[#91A4B8] truncate">{selectedPlantName}</p>
          </div>
        </div>

        {/* Plant & Theme */}
        <div className="rounded-2xl border border-white/10 bg-[#13263A] divide-y divide-white/5">
          <div className="flex items-center justify-between px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-[#20C5E8]" />
              <div>
                <div className="text-xs font-medium text-[#F3F7FC]">Default Plant</div>
                <div className="text-[10px] text-[#91A4B8]">{selectedPlantName}</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#20C997]">Active</span>
          </div>

          <label className="flex items-center justify-between px-3.5 py-3 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Palette className="h-4 w-4 text-[#20C5E8]" />
              <div>
                <div className="text-xs font-medium text-[#F3F7FC]">Industrial Dark Theme</div>
                <div className="text-[10px] text-[#91A4B8]">High-contrast telemetry accents</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrastMode}
              onChange={(e) => toggleSetting('High-contrast telemetry', e.target.checked, setHighContrastMode)}
              className="h-4 w-4 accent-[#20C5E8]"
            />
          </label>
        </div>

        {/* Notifications & Security */}
        <div className="rounded-2xl border border-white/10 bg-[#13263A] divide-y divide-white/5">
          <label className="flex items-center justify-between px-3.5 py-3 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4 text-[#F5A623]" />
              <div>
                <div className="text-xs font-medium text-[#F3F7FC]">Critical Alert Push</div>
                <div className="text-[10px] text-[#91A4B8]">Immediate vibration &amp; temp alerts</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={criticalPush}
              onChange={(e) => toggleSetting('Critical Alert Push', e.target.checked, setCriticalPush)}
              className="h-4 w-4 accent-[#20C5E8]"
            />
          </label>

          <label className="flex items-center justify-between px-3.5 py-3 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4 text-[#20C997]" />
              <div>
                <div className="text-xs font-medium text-[#F3F7FC]">Maintenance Reminders</div>
                <div className="text-[10px] text-[#91A4B8]">48h pre-outage notifications</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={maintenanceReminders}
              onChange={(e) =>
                toggleSetting('Maintenance Reminders', e.target.checked, setMaintenanceReminders)
              }
              className="h-4 w-4 accent-[#20C5E8]"
            />
          </label>

          <label className="flex items-center justify-between px-3.5 py-3 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-[#20C5E8]" />
              <div>
                <div className="text-xs font-medium text-[#F3F7FC]">Biometric Session Lock</div>
                <div className="text-[10px] text-[#91A4B8]">Require FaceID / TouchID</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometricLock}
              onChange={(e) => toggleSetting('Biometric Session Lock', e.target.checked, setBiometricLock)}
              className="h-4 w-4 accent-[#20C5E8]"
            />
          </label>
        </div>

        {/* Support & About */}
        <div className="rounded-2xl border border-white/10 bg-[#13263A] divide-y divide-white/5">
          <button
            type="button"
            onClick={() => setModal('help')}
            className="flex w-full items-center justify-between px-3.5 py-3 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-[#20C5E8]" />
              <span className="text-xs font-medium text-[#F3F7FC]">Help &amp; Operations Support</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#91A4B8]" />
          </button>

          <button
            type="button"
            onClick={() => setModal('about')}
            className="flex w-full items-center justify-between px-3.5 py-3 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 text-[#20C997]" />
              <span className="text-xs font-medium text-[#F3F7FC]">About BioXcell Pulse</span>
            </div>
            <span className="font-mono-num text-[10px] text-[#91A4B8]">v2.4.0</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onExitToSplash}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#EF5350]/30 bg-[#EF5350]/10 py-3 text-xs font-semibold text-[#EF5350] cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Return to Welcome Screen
        </button>
      </div>

      {/* Help / About Modal */}
      {modal && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="w-full rounded-t-3xl border-t border-white/15 bg-[#0D1B2A] p-4 pb-6 shadow-2xl space-y-3 animate-screen-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F3F7FC]">
                {modal === 'help' ? 'Help & Operations Support' : 'About BioXcell Pulse'}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13263A] text-[#91A4B8] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {modal === 'help' ? (
              <p className="text-xs leading-relaxed text-[#91A4B8]">
                This interactive mobile prototype demonstrates turbine monitoring, condition diagnostics, energy reporting, maintenance scheduling, and simulated plant integrations for BioXcell. For engineering inquiries, contact The Brand Design.
              </p>
            ) : (
              <div className="space-y-1.5 text-xs text-[#91A4B8]">
                <p className="font-semibold text-[#F3F7FC]">BioXcell Pulse • Intelligent Power. Complete Control.</p>
                <p>Prototype Build: v2.4.0 (Demo Mode)</p>
                <p>Prepared for: Ed Rasher • BioXcell</p>
                <p>Designed &amp; Engineered by The Brand Design</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
