import React from 'react';
import { Zap, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

interface SplashScreenProps {
  onEnterDemo: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnterDemo }) => {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-[#081525] via-[#0D1B2A] to-[#081525] px-6 py-10">
      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[34%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#20C5E8]/15 blur-3xl"
      />

      {/* Top Brand Pill */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#20C5E8]/30 bg-[#13263A]/80 px-3 py-1 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#20C997] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wider text-[#20C5E8] uppercase">
            Enterprise Power Ops
          </span>
        </div>
        <span className="font-mono-num text-[11px] text-[#91A4B8]">v2.4.0</span>
      </div>

      {/* Center Animated Turbine Emblem */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
          {/* Expanding pulse rings */}
          <div className="animate-pulse-ring absolute inset-0 rounded-full border border-[#20C5E8]/40" />
          <div
            className="animate-pulse-ring absolute inset-3 rounded-full border border-[#20C997]/30"
            style={{ animationDelay: '0.8s' }}
          />
          {/* Rotating turbine rotor SVG */}
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-[#13263A]/90 shadow-[0_0_40px_rgba(32,197,232,0.25)]">
            <svg
              viewBox="0 0 100 100"
              className="animate-spin-slow h-24 w-24 text-[#20C5E8]"
              fill="none"
            >
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="4 4" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <path
                  key={deg}
                  d="M50 50 C54 36, 62 24, 52 13 C46 24, 46 36, 50 50 Z"
                  fill="url(#bladeGrad)"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
              <defs>
                <linearGradient id="bladeGrad" x1="50" y1="13" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#20C5E8" />
                  <stop offset="100%" stopColor="#20C997" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex h-11 w-11 items-center justify-center rounded-full border border-[#20C5E8]/40 bg-[#081525] shadow-inner">
              <Zap className="h-5 w-5 text-[#20C5E8]" />
            </div>
          </div>
        </div>

        <h1 className="text-[28px] font-bold tracking-tight text-[#F3F7FC]">
          BioXcell <span className="text-[#20C5E8]">Pulse</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium tracking-wide text-[#20C997]">
          Intelligent Power. Complete Control.
        </p>
        <p className="mt-4 max-w-[270px] text-xs leading-relaxed text-[#91A4B8]">
          Real-time turbine telemetry, predictive diagnostics, and plant operations intelligence in one unified mobile command center.
        </p>
      </div>

      {/* Bottom Demo Entry */}
      <div className="relative z-10 space-y-3">
        <button
          type="button"
          onClick={onEnterDemo}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#20C5E8] to-[#20C997] px-5 py-3.5 text-sm font-semibold text-[#081525] shadow-[0_10px_28px_-6px_rgba(32,197,232,0.5)] transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
        >
          <span>Launch Interactive Demo</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-[#91A4B8]">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#20C997]" />
            Simulated Plant Data
          </span>
          <span className="inline-flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-[#20C5E8]" />
            No Login Required
          </span>
        </div>
      </div>
    </div>
  );
};
