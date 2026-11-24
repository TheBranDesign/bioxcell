import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Sparkles, Flame, Gauge, Fuel, ArrowUpRight } from 'lucide-react';
import type { Turbine } from '../types/app';
import { DemoDisclaimer, ScreenHeader } from '../components/UiPrimitives';

interface EfficiencyScreenProps {
  turbines: Turbine[];
  onOpenTurbine: (turbineId: string) => void;
  onBack: () => void;
}

export const EfficiencyScreen: React.FC<EfficiencyScreenProps> = ({
  turbines,
  onOpenTurbine,
  onBack,
}) => {
  const chartData = turbines.map((t) => ({
    id: t.id,
    efficiency: t.efficiencyPct,
    color: t.efficiencyPct >= 95 ? '#20C997' : t.efficiencyPct >= 93.5 ? '#20C5E8' : '#F5A623',
  }));

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title="Operational Efficiency"
        subtitle="Thermal Performance & Optimization"
        onBack={onBack}
      />

      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        <DemoDisclaimer text="Simulated AI Optimization: Recommendations below are generated from prototype telemetry and are not validated engineering advice." />

        {/* Key Efficiency KPIs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3 text-center">
            <Gauge className="mx-auto h-4 w-4 text-[#20C997]" />
            <div className="mt-1.5 font-mono-num text-base font-bold text-[#20C997]">94.8%</div>
            <div className="text-[10px] text-[#91A4B8]">Plant Eff.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3 text-center">
            <Flame className="mx-auto h-4 w-4 text-[#20C5E8]" />
            <div className="mt-1.5 font-mono-num text-base font-bold text-[#F3F7FC]">6,420</div>
            <div className="text-[10px] text-[#91A4B8]">BTU/kWh</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3 text-center">
            <Fuel className="mx-auto h-4 w-4 text-[#F5A623]" />
            <div className="mt-1.5 font-mono-num text-base font-bold text-[#F3F7FC]">91.4%</div>
            <div className="text-[10px] text-[#91A4B8]">Fuel Util.</div>
          </div>
        </div>

        {/* Unit Performance Comparison Chart */}
        <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-[#F3F7FC]">Unit Efficiency Comparison</h3>
              <p className="text-[10px] text-[#91A4B8]">Target benchmark: 95.0%</p>
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="id" tick={{ fill: '#91A4B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[90, 98]} tick={{ fill: '#91A4B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(32,197,232,0.08)' }}
                  contentStyle={{
                    backgroundColor: '#081525',
                    borderColor: 'rgba(32,197,232,0.35)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#F3F7FC',
                  }}
                  itemStyle={{ color: '#20C5E8', fontWeight: 600 }}
                  labelStyle={{ color: '#91A4B8' }}
                />
                <Bar dataKey="efficiency" name="Efficiency (%)" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simulated AI-Assisted Insight */}
        <div className="rounded-2xl border border-[#20C5E8]/35 bg-gradient-to-br from-[#13263A] to-[#0a1c2e] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#20C5E8]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold">AI-Assisted Insight (Simulated)</span>
            </div>
            <span className="rounded-full bg-[#20C5E8]/15 px-2 py-0.5 text-[9px] font-semibold text-[#20C5E8]">
              +1.4% Potential
            </span>
          </div>
          <p className="text-xs font-medium leading-relaxed text-[#F3F7FC]">
            Optimization opportunity detected: Turbine T-02 may improve operational efficiency through revised operating parameters.
          </p>
          <p className="text-[11px] leading-relaxed text-[#91A4B8]">
            Adjusting inlet guide vane (IGV) schedule by +1.8° post-bearing inspection is projected to reduce heat rate by ~95 BTU/kWh.
          </p>
          <button
            type="button"
            onClick={() => onOpenTurbine('T-02')}
            className="inline-flex items-center gap-1 rounded-xl border border-[#20C5E8]/40 bg-[#20C5E8]/15 px-3 py-2 text-xs font-semibold text-[#20C5E8] cursor-pointer"
          >
            Inspect Turbine T-02
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
