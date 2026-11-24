import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Download, Calendar, Zap, TrendingUp, Gauge } from 'lucide-react';
import type { ReportRange } from '../types/app';
import { REPORT_DATASETS } from '../data/mockData';
import { ScreenHeader } from '../components/UiPrimitives';

interface ReportsScreenProps {
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ onShowToast }) => {
  const [range, setRange] = useState<ReportRange>('Today');
  const [customStart, setCustomStart] = useState('2026-11-10');
  const [customEnd, setCustomEnd] = useState('2026-11-25');

  const dataset = REPORT_DATASETS[range];

  const handleExport = () => {
    const headers = ['Period', 'Energy (MWh)', 'Average Power (MW)'];
    const rows = dataset.series.map((s) => `${s.label},${s.mwh},${s.avgMw}`);
    const csv = [
      `BioXcell Pulse - Energy Production Report (${range})`,
      `Plant: Riverside Power Station`,
      `Total Generation: ${dataset.totalMWh} MWh,Avg: ${dataset.avgMW} MW,Peak: ${dataset.peakMW} MW,Efficiency: ${dataset.efficiencyPct}%`,
      '',
      headers.join(','),
      ...rows,
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bioxcell-pulse-report-${range.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast(`Exported ${range} energy report (CSV)`, 'success');
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title="Energy Reports"
        subtitle="Generation Analytics & Export"
        rightSlot={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1 rounded-xl bg-[#20C5E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#081525] transition hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        }
      />

      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* Interactive Range Filters */}
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#081525] p-1">
          {(['Today', 'This Week', 'This Month', 'Custom Range'] as ReportRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-lg py-1.5 text-[10px] font-semibold transition cursor-pointer ${
                range === r ? 'bg-[#20C5E8] text-[#081525]' : 'text-[#91A4B8] hover:text-white'
              }`}
            >
              {r === 'Custom Range' ? 'Custom' : r.replace('This ', '')}
            </button>
          ))}
        </div>

        {range === 'Custom Range' && (
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#13263A] p-3">
            <div>
              <label className="block text-[10px] text-[#91A4B8]">Start Date</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#081525] px-2 py-1 text-[11px] text-[#F3F7FC]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#91A4B8]">End Date</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#081525] px-2 py-1 text-[11px] text-[#F3F7FC]"
              />
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3">
            <div className="flex items-center justify-between text-[10px] text-[#91A4B8]">
              <span>Total Generation</span>
              <Zap className="h-3.5 w-3.5 text-[#20C5E8]" />
            </div>
            <div className="mt-1 font-mono-num text-lg font-bold text-[#F3F7FC]">
              {dataset.totalMWh.toLocaleString()} <span className="text-[11px] font-normal text-[#91A4B8]">MWh</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3">
            <div className="flex items-center justify-between text-[10px] text-[#91A4B8]">
              <span>Average Output</span>
              <TrendingUp className="h-3.5 w-3.5 text-[#20C997]" />
            </div>
            <div className="mt-1 font-mono-num text-lg font-bold text-[#F3F7FC]">
              {dataset.avgMW} <span className="text-[11px] font-normal text-[#91A4B8]">MW</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3">
            <div className="flex items-center justify-between text-[10px] text-[#91A4B8]">
              <span>Peak Generation</span>
              <Calendar className="h-3.5 w-3.5 text-[#F5A623]" />
            </div>
            <div className="mt-1 font-mono-num text-lg font-bold text-[#F3F7FC]">
              {dataset.peakMW} <span className="text-[11px] font-normal text-[#91A4B8]">MW</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3">
            <div className="flex items-center justify-between text-[10px] text-[#91A4B8]">
              <span>Op. Efficiency</span>
              <Gauge className="h-3.5 w-3.5 text-[#20C997]" />
            </div>
            <div className="mt-1 font-mono-num text-lg font-bold text-[#20C997]">
              {dataset.efficiencyPct}%
            </div>
          </div>
        </div>

        {/* Energy Production Chart */}
        <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-[#F3F7FC]">Energy Production Trends</h3>
              <p className="text-[10px] text-[#91A4B8]">{range} Output (MWh)</p>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.series} margin={{ top: 6, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#91A4B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#91A4B8', fontSize: 10 }} axisLine={false} tickLine={false} />
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
                <Bar dataKey="mwh" name="Energy (MWh)" fill="#20C5E8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Report Summary */}
        <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3.5 space-y-2">
          <h3 className="text-xs font-semibold text-[#F3F7FC]">Executive Summary</h3>
          <p className="text-[11px] leading-relaxed text-[#91A4B8]">
            Riverside Power Station maintained 100% unit availability across all 4 turbines during the selected <span className="text-[#F3F7FC] font-medium">{range.toLowerCase()}</span> window, delivering <span className="font-mono-num text-[#20C5E8] font-semibold">{dataset.totalMWh.toLocaleString()} MWh</span> at <span className="font-mono-num text-[#20C997] font-semibold">{dataset.efficiencyPct}%</span> thermal efficiency.
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-[#20C5E8]/40 bg-[#20C5E8]/15 py-2.5 text-xs font-semibold text-[#20C5E8] transition hover:bg-[#20C5E8]/25 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export Report (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
