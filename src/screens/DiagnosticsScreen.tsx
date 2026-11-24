import React, { useState } from 'react';
import {
  Activity,
  Thermometer,
  Gauge,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  X,
  ArrowUpRight,
} from 'lucide-react';
import type { AppAlert, Turbine } from '../types/app';
import { DemoDisclaimer, ScreenHeader, SeverityBadge } from '../components/UiPrimitives';

interface DiagnosticsScreenProps {
  turbines: Turbine[];
  alerts: AppAlert[];
  onOpenTurbine: (turbineId: string) => void;
  onScheduleMaintenance: () => void;
}

export const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({
  turbines,
  alerts,
  onOpenTurbine,
  onScheduleMaintenance,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<AppAlert | null>(null);

  const avgHealth = Math.round(
    turbines.reduce((sum, t) => sum + t.healthScore, 0) / turbines.length
  );
  const diagnosticAlerts = alerts.filter((a) => a.category === 'Equipment Health');

  const subsystems = [
    {
      name: 'Vibration Analysis',
      status: 'Warning (T-03: 4.8 mm/s)',
      score: 78,
      icon: Activity,
      color: 'text-[#F5A623]',
      bar: 'bg-[#F5A623]',
    },
    {
      name: 'Temperature Analysis',
      status: 'Advisory (T-02 Brg: 91 °C)',
      score: 86,
      icon: Thermometer,
      color: 'text-[#20C5E8]',
      bar: 'bg-[#20C5E8]',
    },
    {
      name: 'Pressure Monitoring',
      status: 'Nominal (17.8–18.6 bar)',
      score: 96,
      icon: Gauge,
      color: 'text-[#20C997]',
      bar: 'bg-[#20C997]',
    },
    {
      name: 'Bearing Condition',
      status: 'Inspection Queued (Nov 28)',
      score: 85,
      icon: ShieldAlert,
      color: 'text-[#20C5E8]',
      bar: 'bg-[#20C5E8]',
    },
  ];

  // SVG Radial Score Gauge
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (avgHealth / 100) * circumference;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title="Equipment Diagnostics"
        subtitle="Condition Monitoring & Predictive Insights"
      />

      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        <DemoDisclaimer text="Simulated Diagnostic Insights: Values and recommendations are modeled for prototype demonstration and do not replace certified engineering assessments." />

        {/* Overall Health Score Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#13263A] to-[#081525] p-4">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#20C997"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="absolute text-center">
              <div className="font-mono-num text-xl font-bold text-[#F3F7FC]">{avgHealth}</div>
              <div className="text-[9px] uppercase tracking-wider text-[#91A4B8]">Score</div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#20C997]/15 px-2 py-0.5 text-[10px] font-semibold text-[#20C997]">
              Fleet Healthy • 2 Advisories
            </span>
            <h2 className="mt-1.5 text-sm font-bold text-[#F3F7FC]">Overall Equipment Health</h2>
            <p className="mt-0.5 text-[11px] leading-snug text-[#91A4B8]">
              Units T-01 and T-04 operating nominally. T-03 vibration and T-02 bearing temperature flagged for review.
            </p>
          </div>
        </div>

        {/* Subsystem Analysis */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#91A4B8]">
            Condition Subsystems
          </h3>
          {subsystems.map((sub) => {
            const Icon = sub.icon;
            return (
              <div key={sub.name} className="rounded-2xl border border-white/10 bg-[#13263A] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${sub.color}`} />
                    <span className="text-xs font-semibold text-[#F3F7FC]">{sub.name}</span>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-[#F3F7FC]">{sub.score}%</span>
                </div>
                <p className="mt-1 text-[11px] text-[#91A4B8]">{sub.status}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#081525]">
                  <div className={`h-full rounded-full ${sub.bar}`} style={{ width: `${sub.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Diagnostic Alerts */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#91A4B8]">
            Active Diagnostic Anomalies
          </h3>
          {diagnosticAlerts.map((alert) => (
            <button
              key={alert.id}
              type="button"
              onClick={() => setSelectedAlert(alert)}
              className="flex w-full items-start justify-between gap-2 rounded-2xl border border-[#F5A623]/30 bg-[#13263A] p-3 text-left transition hover:border-[#F5A623]/60 cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={alert.severity} />
                  {alert.turbineId && (
                    <span className="font-mono-num text-[10px] font-semibold text-[#20C5E8]">
                      {alert.turbineId}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-semibold text-[#F3F7FC] leading-snug">
                  {alert.title}
                </p>
                <p className="mt-0.5 text-[10px] text-[#91A4B8]">Tap for diagnostic recommendations</p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#91A4B8]" />
            </button>
          ))}
        </div>

        {/* Predictive Maintenance Insight */}
        <div className="rounded-2xl border border-[#20C5E8]/25 bg-[#13263A] p-3.5">
          <div className="flex items-center gap-2 text-[#20C5E8]">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold">Predictive Maintenance Insight (Simulated)</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#91A4B8]">
            Based on harmonic trend extrapolation, Turbine T-03 shaft vibration may exceed 5.2 mm/s within 48 hours at full base load. Recommend scheduling balance check alongside T-02&apos;s Nov 28 outage window.
          </p>
        </div>
      </div>

      {/* Diagnostic Detail Modal */}
      {selectedAlert && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="w-full rounded-t-3xl border-t border-white/15 bg-[#0D1B2A] p-4 pb-6 shadow-2xl animate-screen-in">
            <div className="mb-3 flex items-center justify-between">
              <SeverityBadge severity={selectedAlert.severity} />
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                aria-label="Close diagnostic detail"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13263A] text-[#91A4B8] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-sm font-bold text-[#F3F7FC]">{selectedAlert.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#91A4B8]">{selectedAlert.description}</p>

            {selectedAlert.metricLabel && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#13263A] px-3 py-2 text-xs">
                <span className="text-[#91A4B8]">{selectedAlert.metricLabel}</span>
                <span className="font-mono-num font-bold text-[#F5A623]">{selectedAlert.metricValue}</span>
              </div>
            )}

            <div className="mt-3 rounded-xl border border-[#20C5E8]/25 bg-[#20C5E8]/10 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#20C5E8]">
                Recommended Action (Simulated)
              </div>
              <p className="mt-1 text-xs text-[#F3F7FC]">{selectedAlert.recommendedAction}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {selectedAlert.turbineId && (
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedAlert.turbineId!;
                    setSelectedAlert(null);
                    onOpenTurbine(id);
                  }}
                  className="flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-[#13263A] py-2.5 text-xs font-semibold text-[#F3F7FC] cursor-pointer"
                >
                  Inspect {selectedAlert.turbineId}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedAlert(null);
                  onScheduleMaintenance();
                }}
                className="rounded-xl bg-[#20C5E8] py-2.5 text-xs font-semibold text-[#081525] cursor-pointer"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
