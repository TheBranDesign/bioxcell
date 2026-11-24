import React from 'react';
import {
  Wrench,
  Bell,
  Gauge,
  Network,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react';
import type { ScreenRoute } from '../types/app';

interface MoreSheetProps {
  open: boolean;
  currentRoute: ScreenRoute;
  unreadAlertsCount: number;
  onClose: () => void;
  onNavigate: (route: ScreenRoute) => void;
}

export const MoreSheet: React.FC<MoreSheetProps> = ({
  open,
  currentRoute,
  unreadAlertsCount,
  onClose,
  onNavigate,
}) => {
  if (!open) return null;

  const items: {
    route: ScreenRoute;
    label: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    accent: string;
  }[] = [
    {
      route: 'maintenance',
      label: 'Maintenance',
      subtitle: 'Schedules, inspections & work orders',
      icon: Wrench,
      accent: 'text-[#F5A623] bg-[#F5A623]/15',
    },
    {
      route: 'alerts',
      label: 'Alerts & Notifications',
      subtitle: 'Active equipment & grid advisories',
      icon: Bell,
      badge: unreadAlertsCount,
      accent: 'text-[#EF5350] bg-[#EF5350]/15',
    },
    {
      route: 'efficiency',
      label: 'Operational Efficiency',
      subtitle: 'Heat rate, fuel & AI optimization',
      icon: Gauge,
      accent: 'text-[#20C997] bg-[#20C997]/15',
    },
    {
      route: 'integration',
      label: 'Plant Integration',
      subtitle: 'SCADA, DCS, PMS & IIoT gateways',
      icon: Network,
      accent: 'text-[#20C5E8] bg-[#20C5E8]/15',
    },
    {
      route: 'settings',
      label: 'Profile & Settings',
      subtitle: 'Engineer profile, alerts & security',
      icon: Settings,
      accent: 'text-[#91A4B8] bg-white/10',
    },
  ];

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-[2px]">
      <div className="flex-1" onClick={onClose} />
      <div className="animate-screen-in rounded-t-3xl border-t border-white/15 bg-[#0D1B2A] px-4 pt-3 pb-6 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-semibold text-[#F3F7FC]">Operations Modules</h3>
            <p className="text-[11px] text-[#91A4B8]">BioXcell Pulse Enterprise Suite</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13263A] text-[#91A4B8] hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => {
                  onNavigate(item.route);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-[#20C5E8]/50 bg-[#13263A]'
                    : 'border-white/5 bg-[#13263A]/70 hover:border-white/15 hover:bg-[#13263A]'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-semibold text-[#F3F7FC]">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-[#EF5350] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {item.badge} new
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-[#91A4B8]">{item.subtitle}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#91A4B8]" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
