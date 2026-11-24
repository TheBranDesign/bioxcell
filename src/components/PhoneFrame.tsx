import React from 'react';
import { Wifi, BatteryCharging } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, showStatusBar = true }) => {
  return (
    <div className="relative flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#040b14]">
      {/* Desktop-only industrial ambient backdrop & glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 hidden sm:block"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(32, 197, 232, 0.14) 0%, rgba(32, 201, 151, 0.06) 28%, rgba(4, 11, 20, 0.96) 68%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 hidden opacity-[0.04] sm:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, #20C5E8 1px, transparent 1px), linear-gradient(to bottom, #20C5E8 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Phone Chassis (desktop) / Fullscreen Viewport (mobile) */}
      <div className="phone-scale-wrapper relative z-10 flex h-full w-full flex-col sm:rounded-[50px] sm:bg-gradient-to-b sm:from-[#263547] sm:via-[#111b27] sm:to-[#1d2a3a] sm:p-[11px] sm:shadow-[0_32px_90px_-15px_rgba(0,0,0,0.85),0_0_60px_-10px_rgba(32,197,232,0.18)]">
        {/* Hardware Side Buttons (Desktop Only) */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-[3px] top-[118px] h-[26px] w-[3px] rounded-l-sm bg-[#2c3d52]"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-[3px] top-[164px] h-[48px] w-[3px] rounded-l-sm bg-[#2c3d52]"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-[3px] top-[224px] h-[48px] w-[3px] rounded-l-sm bg-[#2c3d52]"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -right-[3px] top-[185px] h-[68px] w-[3px] rounded-r-sm bg-[#2c3d52]"
        />

        {/* Inner Bezel & Screen */}
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#081525] sm:rounded-[40px] sm:ring-1 sm:ring-white/10">
          {/* Desktop Simulated Status Bar + Dynamic Island */}
          {showStatusBar && (
            <div className="hidden sm:flex shrink-0 items-center justify-between bg-[#081525]/95 px-6 pt-3 pb-1.5 text-[11px] font-semibold tracking-tight text-[#F3F7FC] select-none z-30">
              <span className="font-mono-num w-12">01:29</span>
              {/* Dynamic Island */}
              <div className="flex h-[24px] w-[96px] items-center justify-between rounded-full bg-black px-2.5 shadow-inner ring-1 ring-white/5">
                <span className="h-2 w-2 rounded-full bg-[#13263A] ring-1 ring-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#0b192c] ring-1 ring-[#20C5E8]/30" />
              </div>
              <div className="flex w-12 items-center justify-end gap-1.5 text-[#F3F7FC]">
                <div className="flex items-end gap-[1.5px]">
                  <span className="h-1.5 w-[2px] rounded-full bg-[#F3F7FC]" />
                  <span className="h-2 w-[2px] rounded-full bg-[#F3F7FC]" />
                  <span className="h-2.5 w-[2px] rounded-full bg-[#F3F7FC]" />
                  <span className="h-3 w-[2px] rounded-full bg-[#F3F7FC]" />
                </div>
                <Wifi className="h-3 w-3" />
                <BatteryCharging className="h-3.5 w-3.5 text-[#20C997]" />
              </div>
            </div>
          )}

          {/* App Viewport Content */}
          <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>

          {/* Desktop Home Indicator Pill */}
          <div className="hidden sm:flex shrink-0 items-center justify-center bg-[#081525] pb-2 pt-1">
            <div className="h-[4px] w-[116px] rounded-full bg-white/25" />
          </div>
        </div>
      </div>
    </div>
  );
};
