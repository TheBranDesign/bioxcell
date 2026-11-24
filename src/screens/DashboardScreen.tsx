import React, { useState } from 'react';
import {
  Radio,
  Bell,
  Wrench,
  ChevronDown,
  ChevronRight,
  Activity,
  FileBarChart2,
  Network,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { AppAlert, MaintenanceTask, PlantInfo, ScreenRoute, Turbine } from '../types/app';
import { DASHBOARD_GENERATION_SERIES } from '../data/mockData';
import { StatusBadge, SeverityBadge } from '../components/UiPrimitives';

interface DashboardScreenProps {
  plants: PlantInfo[];
  selectedPlant: PlantInfo;
  onSelectPlant: (plantId: string) => void;
  turbines: Turbine[];
  alerts: AppAlert[];
  tasks: MaintenanceTask[];
  livePowerMW: number;
  onOpenTurbine: (turbineId: string) => void;
  onNavigate: (route: ScreenRoute) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  plants,
  selectedPlant,
  onSelectPlant,
  turbines,
  alerts,
  tasks,
  livePowerMW,
  onOpenTurbine,
  onNavigate,
}) => {
  const [plantMenuOpen, setPlantMenuOpen] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.read);
  const nextMaintenance = tasks.find((t) => t.status === 'Upcoming' || t.status === 'Scheduled');
  const activeTurbinesCount = turbines.filter((t) => t.status !== 'Offline').length;
  const avgHealth = Math.round(
    turbines.reduce((sum, t) => sum + t.healthScore, 0) / turbines.length
  );

  return (
    <div className="mobile-scroll flex-1 overflow-y-auto bg-[#0D1B2A] px-4 pt-3 pb-5 space-y-4 animate-screen-in">
      {/* Top Welcome + Plant Selector */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-[#91A4B8]">BioXcell Pulse • Live Ops</p>
          <h1 className="text-lg font-bold tracking-tight text-[#F3F7FC]">Good Morning, Alex.</h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('alerts')}
          aria-label="Open alerts"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#13263A] text-[#F3F7FC] hover:border-[#20C5E8]/50 transition cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {unreadAlerts.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EF5350] px-1 text-[9px] font-bold text-white">
              {unreadAlerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Plant Selector Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setPlantMenuOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#13263A] px-3.5 py-2.5 text-left transition hover:border-[#20C5E8]/40 cursor-pointer"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#20C997] shadow-[0_0_8px_#20C997]" />
              <span className="truncate text-xs font-semibold text-[#F3F7FC]">
                {selectedPlant.name}
              </span>
            </div>
            <p className="mt-0.5 truncate pl-4 text-[10px] text-[#91A4B8]">
              {selectedPlant.status} • {selectedPlant.location}
            </p>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#91A4B8] transition-transform ${
              plantMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {plantMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-2xl border border-white/15 bg-[#081525] p-1.5 shadow-2xl">
            {plants.map((plant) => (
              <button
                key={plant.id}
                type="button"
                onClick={() => {
                  onSelectPlant(plant.id);
                  setPlantMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer ${
                  plant.id === selectedPlant.id
                    ? 'bg-[#13263A] text-[#20C5E8] font-semibold'
                    : 'text-[#F3F7FC] hover:bg-[#13263A]/60'
                }`}
              >
                <span>{plant.name}</span>
                <span className="text-[10px] text-[#91A4B8]">{plant.capacityMW} MW Cap</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hero Generation Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#20C5E8]/25 bg-gradient-to-br from-[#13263A] via-[#102235] to-[#081525] p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#91A4B8]">Total Power Generation</span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="font-mono-num text-[28px] font-bold leading-none text-[#F3F7FC]">
                {livePowerMW.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-[#20C5E8]">MW</span>
            </div>
          </div>
          <div className="rounded-xl border border-[#20C997]/30 bg-[#20C997]/10 px-2.5 py-1 text-right">
            <div className="text-[10px] text-[#91A4B8]">Efficiency</div>
            <div className="font-mono-num text-xs font-bold text-[#20C997]">94.8%</div>
          </div>
        </div>

        {/* Mini Real-Time Generation Chart */}
        <div className="mt-3 h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DASHBOARD_GENERATION_SERIES} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="dashGenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20C5E8" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#20C5E8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#91A4B8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[220, 260]}
                tick={{ fill: '#91A4B8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#081525',
                  borderColor: 'rgba(32,197,232,0.35)',
                  borderRadius: '10px',
                  fontSize: '11px',
                  color: '#F3F7FC',
                }}
              />
              <Area
                type="monotone"
                dataKey="mw"
                name="Output (MW)"
                stroke="#20C5E8"
                strokeWidth={2.2}
                fill="url(#dashGenGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Telemetry Strip */}
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-2.5 text-center">
          <div>
            <div className="text-[10px] text-[#91A4B8]">Active Units</div>
            <div className="font-mono-num text-xs font-bold text-[#F3F7FC]">
              {activeTurbinesCount}/{turbines.length}
            </div>
          </div>
          <div className="border-x border-white/10">
            <div className="text-[10px] text-[#91A4B8]">Grid Freq</div>
            <div className="font-mono-num text-xs font-bold text-[#20C997]">
              {selectedPlant.gridFrequencyHz.toFixed(2)} Hz
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#91A4B8]">Today&apos;s Energy</div>
            <div className="font-mono-num text-xs font-bold text-[#20C5E8]">5,842 MWh</div>
          </div>
        </div>
      </div>

      {/* Quick KPI Row: Active Alerts & Next Maintenance */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('alerts')}
          className="rounded-2xl border border-[#F5A623]/25 bg-[#13263A] p-3 text-left transition hover:border-[#F5A623]/50 active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-[#91A4B8]">Active Alerts</span>
            <Bell className="h-3.5 w-3.5 text-[#F5A623]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono-num text-xl font-bold text-[#F3F7FC]">
              {unreadAlerts.length}
            </span>
            <span className="text-[10px] font-medium text-[#F5A623]">Attention</span>
          </div>
          <p className="mt-1 truncate text-[10px] text-[#91A4B8]">T-03 Vib • T-02 Bearing</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('maintenance')}
          className="rounded-2xl border border-white/10 bg-[#13263A] p-3 text-left transition hover:border-[#20C5E8]/40 active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-[#91A4B8]">Next Maintenance</span>
            <Wrench className="h-3.5 w-3.5 text-[#20C5E8]" />
          </div>
          <div className="mt-1 text-xs font-bold text-[#F3F7FC] truncate">
            {nextMaintenance ? nextMaintenance.turbineId : 'None'} • Nov 28
          </div>
          <p className="mt-1 truncate text-[10px] text-[#91A4B8]">
            {nextMaintenance ? nextMaintenance.title.replace('Turbine T-02 – ', '') : 'All clear'}
          </p>
        </button>
      </div>

      {/* Equipment Health & Efficiency Summary */}
      <div className="rounded-2xl border border-white/10 bg-[#13263A] p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#20C997]/15 text-[#20C997]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-[#F3F7FC]">Fleet Health &amp; Efficiency</h2>
              <p className="text-[10px] text-[#91A4B8]">Composite diagnostic score</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('diagnostics')}
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#20C5E8] hover:underline cursor-pointer"
          >
            Details <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#91A4B8]">Overall Equipment Health</span>
            <span className="font-mono-num font-bold text-[#20C997]">{avgHealth}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#081525]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#20C5E8] to-[#20C997] transition-all duration-500"
              style={{ width: `${avgHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Turbine Operational Status Cards */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#91A4B8]">
            Turbine Fleet Status
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('turbines')}
            className="text-[11px] font-semibold text-[#20C5E8] cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {turbines.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onOpenTurbine(t.id)}
              className="rounded-2xl border border-white/10 bg-[#13263A] p-3 text-left transition hover:border-[#20C5E8]/40 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#F3F7FC]">{t.id}</span>
                <StatusBadge status={t.status} />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono-num text-base font-bold text-[#F3F7FC]">
                  {t.powerMW.toFixed(1)}
                </span>
                <span className="text-[10px] text-[#91A4B8]">MW</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-[#91A4B8]">
                <span>Eff {t.efficiencyPct}%</span>
                <span className="font-mono-num">{t.vibrationMmS} mm/s</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Operational Alerts */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#91A4B8]">
            Recent Operational Alerts
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('alerts')}
            className="text-[11px] font-semibold text-[#20C5E8] cursor-pointer"
          >
            Alert Center
          </button>
        </div>
        <div className="space-y-2">
          {alerts.slice(0, 2).map((alert) => (
            <button
              key={alert.id}
              type="button"
              onClick={() => onNavigate('alerts')}
              className="flex w-full items-start justify-between gap-2 rounded-2xl border border-white/10 bg-[#13263A] p-3 text-left transition hover:border-[#F5A623]/40 cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-[10px] text-[#91A4B8]">{alert.timestamp}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-[#F3F7FC] leading-snug">
                  {alert.title}
                </p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#91A4B8]" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#91A4B8]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Diagnostics', icon: Radio, route: 'diagnostics' as ScreenRoute, color: 'text-[#20C5E8]' },
            { label: 'Reports', icon: FileBarChart2, route: 'reports' as ScreenRoute, color: 'text-[#20C997]' },
            { label: 'Efficiency', icon: Sparkles, route: 'efficiency' as ScreenRoute, color: 'text-[#F5A623]' },
            { label: 'Plant Sync', icon: Network, route: 'integration' as ScreenRoute, color: 'text-[#20C5E8]' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => onNavigate(action.route)}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#13263A] py-2.5 px-1 text-center transition hover:border-[#20C5E8]/40 active:scale-95 cursor-pointer"
              >
                <Icon className={`h-4 w-4 ${action.color}`} />
                <span className="text-[10px] font-medium text-[#F3F7FC]">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
