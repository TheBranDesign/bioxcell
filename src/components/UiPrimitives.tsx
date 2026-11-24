import React from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import type { TurbineStatus, AlertSeverity } from '../types/app';

export const StatusBadge: React.FC<{ status: TurbineStatus | string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Optimal: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
    Connected: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
    Completed: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
    Advisory: 'bg-[#20C5E8]/15 text-[#20C5E8] border-[#20C5E8]/30',
    Scheduled: 'bg-[#20C5E8]/15 text-[#20C5E8] border-[#20C5E8]/30',
    Preventive: 'bg-[#20C5E8]/15 text-[#20C5E8] border-[#20C5E8]/30',
    Standby: 'bg-[#91A4B8]/15 text-[#91A4B8] border-[#91A4B8]/30',
    Warning: 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30',
    Upcoming: 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30',
    Offline: 'bg-[#EF5350]/15 text-[#EF5350] border-[#EF5350]/30',
    Overdue: 'bg-[#EF5350]/15 text-[#EF5350] border-[#EF5350]/30',
    Critical: 'bg-[#EF5350]/15 text-[#EF5350] border-[#EF5350]/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
        styles[status] || 'bg-white/10 text-[#F3F7FC] border-white/15'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Optimal' || status === 'Connected' || status === 'Completed'
            ? 'bg-[#20C997]'
            : status === 'Warning' || status === 'Upcoming'
            ? 'bg-[#F5A623]'
            : status === 'Offline' || status === 'Overdue' || status === 'Critical'
            ? 'bg-[#EF5350]'
            : 'bg-[#20C5E8]'
        }`}
      />
      {status}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const map: Record<AlertSeverity, string> = {
    Critical: 'bg-[#EF5350]/15 text-[#EF5350] border-[#EF5350]/30',
    Warning: 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30',
    Maintenance: 'bg-[#20C5E8]/15 text-[#20C5E8] border-[#20C5E8]/30',
    Info: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${map[severity]}`}>
      {severity}
    </span>
  );
};

export const ScreenHeader: React.FC<{
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}> = ({ title, subtitle, onBack, rightSlot }) => (
  <header className="shrink-0 flex items-center justify-between gap-2 border-b border-white/10 bg-[#081525]/90 px-4 py-3 backdrop-blur-md">
    <div className="flex items-center gap-2.5 min-w-0">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#13263A] text-[#F3F7FC] hover:border-[#20C5E8]/50 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-[15px] font-semibold tracking-tight text-[#F3F7FC]">{title}</h1>
        {subtitle && <p className="truncate text-[11px] text-[#91A4B8]">{subtitle}</p>}
      </div>
    </div>
    {rightSlot && <div className="shrink-0">{rightSlot}</div>}
  </header>
);

export const ToastBanner: React.FC<{
  message: string | null;
  type?: 'success' | 'warning' | 'info';
}> = ({ message, type = 'success' }) => {
  if (!message) return null;
  const Icon = type === 'warning' ? AlertTriangle : type === 'info' ? Info : CheckCircle2;
  const color =
    type === 'warning'
      ? 'border-[#F5A623]/40 bg-[#1b2432] text-[#F5A623]'
      : type === 'info'
      ? 'border-[#20C5E8]/40 bg-[#13263A] text-[#20C5E8]'
      : 'border-[#20C997]/40 bg-[#10292d] text-[#20C997]';

  return (
    <div className="pointer-events-none absolute top-14 left-3 right-3 z-50 flex justify-center animate-screen-in">
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium shadow-xl backdrop-blur-md ${color}`}>
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-[#F3F7FC]">{message}</span>
      </div>
    </div>
  );
};

export const DemoDisclaimer: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2 rounded-xl border border-[#20C5E8]/25 bg-[#20C5E8]/8 px-3 py-2 text-[11px] leading-relaxed text-[#91A4B8]">
    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#20C5E8]" />
    <span>{text}</span>
  </div>
);
