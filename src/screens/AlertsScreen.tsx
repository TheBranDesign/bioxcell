import React, { useState } from 'react';
import { Bell, Check, Trash2, ArrowUpRight, X } from 'lucide-react';
import type { AlertSeverity, AppAlert } from '../types/app';
import { ScreenHeader, SeverityBadge } from '../components/UiPrimitives';

interface AlertsScreenProps {
  alerts: AppAlert[];
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpenTurbine: (turbineId: string) => void;
  onBack: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onMarkRead,
  onDismiss,
  onOpenTurbine,
  onBack,
}) => {
  const [filter, setFilter] = useState<'All' | AlertSeverity>('All');
  const [selected, setSelected] = useState<AppAlert | null>(null);

  const filtered = filter === 'All' ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title="Alerts & Notifications"
        subtitle={`${alerts.filter((a) => !a.read).length} Unread Notifications`}
        onBack={onBack}
      />

      {/* Filter Pills */}
      <div className="shrink-0 flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        {(['All', 'Critical', 'Warning', 'Maintenance', 'Info'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition cursor-pointer ${
              filter === cat ? 'bg-[#20C5E8] text-[#081525]' : 'bg-[#13263A] text-[#91A4B8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Bell className="h-8 w-8 text-[#91A4B8]/40" />
            <p className="mt-2 text-xs font-medium text-[#91A4B8]">No notifications in this category.</p>
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                setSelected(alert);
                if (!alert.read) onMarkRead(alert.id);
              }}
              className={`rounded-2xl border p-3.5 transition cursor-pointer ${
                alert.read
                  ? 'border-white/10 bg-[#13263A]/70'
                  : 'border-[#20C5E8]/40 bg-[#13263A]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!alert.read && <span className="h-2 w-2 rounded-full bg-[#20C5E8]" />}
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-[10px] text-[#91A4B8]">{alert.category}</span>
                </div>
                <span className="text-[10px] text-[#91A4B8]">{alert.timestamp}</span>
              </div>
              <h3 className="mt-1.5 text-xs font-bold text-[#F3F7FC]">{alert.title}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] text-[#91A4B8]">{alert.description}</p>

              <div className="mt-2.5 flex items-center justify-end gap-2">
                {!alert.read && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(alert.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#081525] px-2 py-1 text-[10px] font-medium text-[#20C997] cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                    Mark read
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(alert.id);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#081525] px-2 py-1 text-[10px] font-medium text-[#91A4B8] hover:text-[#EF5350] cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal */}
      {selected && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="w-full rounded-t-3xl border-t border-white/15 bg-[#0D1B2A] p-4 pb-6 shadow-2xl animate-screen-in">
            <div className="mb-3 flex items-center justify-between">
              <SeverityBadge severity={selected.severity} />
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13263A] text-[#91A4B8] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-sm font-bold text-[#F3F7FC]">{selected.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#91A4B8]">{selected.description}</p>

            <div className="mt-3 rounded-xl border border-white/10 bg-[#13263A] p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#20C5E8]">
                Recommended Action
              </div>
              <p className="mt-1 text-xs text-[#F3F7FC]">{selected.recommendedAction}</p>
            </div>

            <div className="mt-4 flex gap-2.5">
              {selected.turbineId && (
                <button
                  type="button"
                  onClick={() => {
                    const id = selected.turbineId!;
                    setSelected(null);
                    onOpenTurbine(id);
                  }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#20C5E8] py-2.5 text-xs font-bold text-[#081525] cursor-pointer"
                >
                  Go to {selected.turbineId}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onDismiss(selected.id);
                  setSelected(null);
                }}
                className="flex-1 rounded-xl border border-white/15 bg-[#13263A] py-2.5 text-xs font-semibold text-[#F3F7FC] cursor-pointer"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
