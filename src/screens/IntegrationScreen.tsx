import React, { useState } from 'react';
import { Network, RefreshCw, SlidersHorizontal, CheckCircle2, X } from 'lucide-react';
import type { PlantIntegrationItem } from '../types/app';
import { DemoDisclaimer, ScreenHeader, StatusBadge } from '../components/UiPrimitives';

interface IntegrationScreenProps {
  integrations: PlantIntegrationItem[];
  onSyncIntegration: (id: string) => void;
  onUpdateIntegration: (id: string, pollingIntervalSec: number, autoSync: boolean) => void;
  onBack: () => void;
}

export const IntegrationScreen: React.FC<IntegrationScreenProps> = ({
  integrations,
  onSyncIntegration,
  onUpdateIntegration,
  onBack,
}) => {
  const [selected, setSelected] = useState<PlantIntegrationItem | null>(null);
  const [polling, setPolling] = useState(5);
  const [autoSync, setAutoSync] = useState(true);

  const openConfig = (item: PlantIntegrationItem) => {
    setSelected(item);
    setPolling(item.pollingIntervalSec);
    setAutoSync(item.autoSync);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title="Plant Integration"
        subtitle="SCADA, DCS, PMS & IIoT Gateways"
        onBack={onBack}
      />

      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <DemoDisclaimer text="Simulated Integrations: All plant system connections, endpoints, and telemetry streams are simulated for prototype demonstration. No live plant infrastructure is connected." />

        {integrations.map((item) => (
          <div
            key={item.id}
            onClick={() => openConfig(item)}
            className="rounded-2xl border border-white/10 bg-[#13263A] p-3.5 transition hover:border-[#20C5E8]/40 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#081525] text-[#20C5E8]">
                  <Network className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#20C5E8]">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#F3F7FC]">{item.name}</h3>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-xl bg-[#081525]/80 p-2 text-[10px]">
              <div>
                <span className="text-[#91A4B8]">Last Sync</span>
                <div className="font-semibold text-[#F3F7FC]">{item.lastSync}</div>
              </div>
              <div>
                <span className="text-[#91A4B8]">Throughput</span>
                <div className="font-mono-num font-semibold text-[#20C997]">{item.transmissionRate}</div>
              </div>
              <div>
                <span className="text-[#91A4B8]">Health</span>
                <div className="font-mono-num font-semibold text-[#F3F7FC]">{item.healthPct}%</div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[#91A4B8]">
              <span className="truncate">{item.connectedEquipment.join(' • ')}</span>
              <span className="inline-flex shrink-0 items-center gap-1 text-[#20C5E8] font-semibold">
                <SlidersHorizontal className="h-3 w-3" />
                Configure
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Config Modal */}
      {selected && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="w-full rounded-t-3xl border-t border-white/15 bg-[#0D1B2A] p-4 pb-6 shadow-2xl space-y-3 animate-screen-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#20C5E8]">
                  {selected.category}
                </span>
                <h3 className="text-sm font-bold text-[#F3F7FC]">{selected.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13263A] text-[#91A4B8] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#13263A] p-3 text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#91A4B8]">Protocol</span>
                <span className="font-medium text-[#F3F7FC]">{selected.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#91A4B8]">Simulated Endpoint</span>
                <span className="font-mono-num text-[10px] text-[#20C5E8]">{selected.endpoint}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#91A4B8]">
                Telemetry Polling Interval ({polling}s)
              </label>
              <input
                type="range"
                min={1}
                max={60}
                value={polling}
                onChange={(e) => setPolling(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#20C5E8]"
              />
            </div>

            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#13263A] px-3 py-2.5 cursor-pointer">
              <span className="text-xs font-medium text-[#F3F7FC]">Automatic Telemetry Sync</span>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="h-4 w-4 accent-[#20C5E8]"
              />
            </label>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSyncIntegration(selected.id);
                  setSelected(null);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#20C997]/40 bg-[#20C997]/15 py-2.5 text-xs font-semibold text-[#20C997] cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Sync Now
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateIntegration(selected.id, polling, autoSync);
                  setSelected(null);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#20C5E8] py-2.5 text-xs font-bold text-[#081525] cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Save Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
