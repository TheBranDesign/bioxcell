import React, { useState } from 'react';
import { Cpu, Thermometer, Activity, Gauge, ChevronRight } from 'lucide-react';
import type { Turbine, TurbineStatus } from '../types/app';
import { ScreenHeader, StatusBadge } from '../components/UiPrimitives';

interface TurbinesScreenProps {
  turbines: Turbine[];
  onSelectTurbine: (turbineId: string) => void;
}

export const TurbinesScreen: React.FC<TurbinesScreenProps> = ({ turbines, onSelectTurbine }) => {
  const [filter, setFilter] = useState<'All' | TurbineStatus>('All');

  const filtered =
    filter === 'All' ? turbines : turbines.filter((t) => t.status === filter);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title="Turbine Monitoring"
        subtitle="Riverside Power Station • 4 Active Units"
        rightSlot={
          <span className="font-mono-num rounded-lg border border-[#20C997]/30 bg-[#20C997]/10 px-2 py-1 text-[10px] font-semibold text-[#20C997]">
            248.6 MW
          </span>
        }
      />

      {/* Filter Pills */}
      <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 border-b border-white/5">
        {(['All', 'Optimal', 'Advisory', 'Warning'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition cursor-pointer ${
              filter === tab
                ? 'bg-[#20C5E8] text-[#081525]'
                : 'bg-[#13263A] text-[#91A4B8] hover:text-[#F3F7FC]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Turbine Cards */}
      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {filtered.map((turbine) => (
          <button
            key={turbine.id}
            type="button"
            onClick={() => onSelectTurbine(turbine.id)}
            className="w-full rounded-2xl border border-white/10 bg-[#13263A] p-3.5 text-left transition hover:border-[#20C5E8]/50 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#081525] text-[#20C5E8]">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[#F3F7FC]">{turbine.name}</h2>
                    <StatusBadge status={turbine.status} />
                  </div>
                  <p className="text-[11px] text-[#91A4B8]">{turbine.model}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#91A4B8]" />
            </div>

            {/* Primary Telemetry Grid */}
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#081525]/80 p-2.5">
              <div>
                <div className="text-[10px] text-[#91A4B8]">Power Output</div>
                <div className="font-mono-num text-xs font-bold text-[#F3F7FC]">
                  {turbine.powerMW.toFixed(1)} MW
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#91A4B8]">Rotor Speed</div>
                <div className="font-mono-num text-xs font-bold text-[#F3F7FC]">
                  {turbine.rpm.toLocaleString()} RPM
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#91A4B8]">Efficiency</div>
                <div className="font-mono-num text-xs font-bold text-[#20C997]">
                  {turbine.efficiencyPct}%
                </div>
              </div>
            </div>

            {/* Secondary Health Row */}
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span
                className={`inline-flex items-center gap-1 ${
                  turbine.bearingTempC >= 90 ? 'text-[#F5A623]' : 'text-[#91A4B8]'
                }`}
              >
                <Thermometer className="h-3.5 w-3.5" />
                {turbine.exhaustTempC}°C Exh / {turbine.bearingTempC}°C Brg
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono-num ${
                  turbine.vibrationMmS >= 4.0 ? 'text-[#F5A623] font-semibold' : 'text-[#91A4B8]'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                {turbine.vibrationMmS} mm/s
              </span>
            </div>

            {/* Health Bar */}
            <div className="mt-2.5 flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-[#20C5E8]" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#081525]">
                <div
                  className={`h-full rounded-full ${
                    turbine.healthScore >= 90
                      ? 'bg-[#20C997]'
                      : turbine.healthScore >= 85
                      ? 'bg-[#20C5E8]'
                      : 'bg-[#F5A623]'
                  }`}
                  style={{ width: `${turbine.healthScore}%` }}
                />
              </div>
              <span className="font-mono-num text-[10px] font-semibold text-[#F3F7FC]">
                {turbine.healthScore}% Health
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
