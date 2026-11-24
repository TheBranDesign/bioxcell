import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Thermometer,
  Gauge,
  Zap,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import type { TimeRange, Turbine } from '../types/app';
import { ScreenHeader, StatusBadge } from '../components/UiPrimitives';

interface TurbineDetailScreenProps {
  turbine: Turbine;
  onBack: () => void;
  onOpenDiagnostics: () => void;
  onOpenMaintenance: () => void;
}

export const TurbineDetailScreen: React.FC<TurbineDetailScreenProps> = ({
  turbine,
  onBack,
  onOpenDiagnostics,
  onOpenMaintenance,
}) => {
  const [range, setRange] = useState<TimeRange>('24H');
  const [chartMetric, setChartMetric] = useState<'power' | 'vibration' | 'efficiency'>('power');

  const data = turbine.history[range];
  const heroImg = `${import.meta.env.BASE_URL}turbine-hero.jpg`;

  const metricConfig = {
    power: { label: 'Output (MW)', color: '#20C5E8' },
    vibration: { label: 'Vibration (mm/s)', color: '#F5A623' },
    efficiency: { label: 'Efficiency (%)', color: '#20C997' },
  }[chartMetric];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title={turbine.name}
        subtitle={`${turbine.model} • ${turbine.serial}`}
        onBack={onBack}
        rightSlot={<StatusBadge status={turbine.status} />}
      />

      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* Realistic Industrial Turbine Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#081525]">
          <img
            src={heroImg}
            alt={`${turbine.name} rotor assembly`}
            className="h-32 w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081525] via-[#081525]/45 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#20C5E8]">
                Live Telemetry
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono-num text-2xl font-bold text-[#F3F7FC]">
                  {turbine.powerMW.toFixed(1)}
                </span>
                <span className="text-xs text-[#91A4B8]">/ {turbine.capacityMW} MW</span>
              </div>
            </div>
            {/* Visual Condition Ring */}
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#081525]/85 px-2.5 py-1.5 backdrop-blur-md">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  turbine.healthScore >= 90
                    ? 'bg-[#20C997] shadow-[0_0_8px_#20C997]'
                    : 'bg-[#F5A623] shadow-[0_0_8px_#F5A623]'
                }`}
              />
              <div className="text-right">
                <div className="text-[9px] text-[#91A4B8]">Condition</div>
                <div className="font-mono-num text-xs font-bold text-[#F3F7FC]">
                  {turbine.healthScore}/100
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Callout if T-03 or T-02 */}
        {(turbine.vibrationMmS >= 4.0 || turbine.bearingTempC >= 90) && (
          <button
            type="button"
            onClick={onOpenDiagnostics}
            className="flex w-full items-center gap-2.5 rounded-2xl border border-[#F5A623]/40 bg-[#F5A623]/10 p-3 text-left cursor-pointer"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#F5A623]" />
            <div className="min-w-0 flex-1 text-[11px] text-[#F3F7FC]">
              {turbine.vibrationMmS >= 4.0
                ? 'Elevated vibration detected (4.8 mm/s). Tap to review diagnostics.'
                : 'Bearing temperature approaching threshold (91 °C). Tap for details.'}
            </div>
          </button>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Rotor Speed', value: `${turbine.rpm.toLocaleString()} RPM`, icon: Gauge, accent: 'text-[#20C5E8]' },
            { label: 'Thermal Efficiency', value: `${turbine.efficiencyPct}%`, icon: Zap, accent: 'text-[#20C997]' },
            {
              label: 'Bearing Temp',
              value: `${turbine.bearingTempC} °C`,
              icon: Thermometer,
              accent: turbine.bearingTempC >= 90 ? 'text-[#F5A623]' : 'text-[#F3F7FC]',
            },
            { label: 'Exhaust Temp', value: `${turbine.exhaustTempC} °C`, icon: Thermometer, accent: 'text-[#F3F7FC]' },
            {
              label: 'Vibration Level',
              value: `${turbine.vibrationMmS} mm/s`,
              icon: Activity,
              accent: turbine.vibrationMmS >= 4.0 ? 'text-[#F5A623]' : 'text-[#20C997]',
            },
            { label: 'Discharge Pressure', value: `${turbine.pressureBar} bar`, icon: Gauge, accent: 'text-[#20C5E8]' },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-[#13263A] p-3">
                <div className="flex items-center justify-between text-[10px] text-[#91A4B8]">
                  <span>{m.label}</span>
                  <Icon className="h-3.5 w-3.5 text-[#91A4B8]" />
                </div>
                <div className={`mt-1 font-mono-num text-sm font-bold ${m.accent}`}>{m.value}</div>
              </div>
            );
          })}
        </div>

        {/* Performance History Chart + Interactive Time Filters */}
        <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-semibold text-[#F3F7FC]">Performance History</h3>
              <p className="text-[10px] text-[#91A4B8]">{metricConfig.label}</p>
            </div>
            <div className="flex rounded-xl bg-[#081525] p-0.5">
              {(['1H', '6H', '24H', '7D'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition cursor-pointer ${
                    range === r ? 'bg-[#20C5E8] text-[#081525]' : 'text-[#91A4B8] hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Switcher */}
          <div className="mt-2.5 flex gap-1.5">
            {(
              [
                { id: 'power', label: 'Power' },
                { id: 'vibration', label: 'Vibration' },
                { id: 'efficiency', label: 'Efficiency' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setChartMetric(opt.id)}
                className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium transition cursor-pointer ${
                  chartMetric === opt.id
                    ? 'border-[#20C5E8]/50 bg-[#20C5E8]/15 text-[#20C5E8]'
                    : 'border-white/10 bg-[#081525]/60 text-[#91A4B8]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-3 h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="turbineDetailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricConfig.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={metricConfig.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#91A4B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#91A4B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#081525',
                    borderColor: 'rgba(32,197,232,0.3)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#F3F7FC',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartMetric}
                  name={metricConfig.label}
                  stroke={metricConfig.color}
                  strokeWidth={2.2}
                  fill="url(#turbineDetailGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pb-2">
          <button
            type="button"
            onClick={onOpenDiagnostics}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#20C5E8]/40 bg-[#20C5E8]/15 py-2.5 text-xs font-semibold text-[#20C5E8] transition hover:bg-[#20C5E8]/25 cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5" />
            Diagnostics
          </button>
          <button
            type="button"
            onClick={onOpenMaintenance}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-[#13263A] py-2.5 text-xs font-semibold text-[#F3F7FC] transition hover:border-white/30 cursor-pointer"
          >
            <Wrench className="h-3.5 w-3.5" />
            Maintenance
          </button>
        </div>
      </div>
    </div>
  );
};
