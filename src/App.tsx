import { useEffect, useState } from 'react';
import {
  INITIAL_ALERTS,
  INITIAL_INTEGRATIONS,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_TURBINES,
  PLANTS,
} from './data/mockData';
import type {
  AppAlert,
  MaintenanceStatus,
  MaintenanceTask,
  PlantIntegrationItem,
  PrimaryTab,
  ScreenRoute,
  Turbine,
} from './types/app';
import { PhoneFrame } from './components/PhoneFrame';
import { BottomNav } from './components/BottomNav';
import { MoreSheet } from './components/MoreSheet';
import { ToastBanner } from './components/UiPrimitives';
import { SplashScreen } from './screens/SplashScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { TurbinesScreen } from './screens/TurbinesScreen';
import { TurbineDetailScreen } from './screens/TurbineDetailScreen';
import { DiagnosticsScreen } from './screens/DiagnosticsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { EfficiencyScreen } from './screens/EfficiencyScreen';
import { IntegrationScreen } from './screens/IntegrationScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export function App() {
  const [route, setRoute] = useState<ScreenRoute>('splash');
  const [previousRoute, setPreviousRoute] = useState<ScreenRoute>('home');
  const [moreOpen, setMoreOpen] = useState(false);

  const [selectedPlantId, setSelectedPlantId] = useState(PLANTS[0].id);
  const [turbines, setTurbines] = useState<Turbine[]>(INITIAL_TURBINES);
  const [selectedTurbineId, setSelectedTurbineId] = useState<string>('T-01');
  const [alerts, setAlerts] = useState<AppAlert[]>(INITIAL_ALERTS);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [integrations, setIntegrations] = useState<PlantIntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Subtle, realistic telemetry micro-variation every 10 seconds
  useEffect(() => {
    if (route === 'splash') return;
    const interval = window.setInterval(() => {
      setTurbines((prev) =>
        prev.map((t, idx) => {
          const base = INITIAL_TURBINES[idx];
          const delta = (Math.random() - 0.5) * 0.2;
          return {
            ...t,
            powerMW: Number((base.powerMW + delta).toFixed(1)),
          };
        })
      );
    }, 10000);
    return () => window.clearInterval(interval);
  }, [route]);

  const navigateTo = (next: ScreenRoute) => {
    setPreviousRoute(route === 'splash' ? 'home' : route);
    setRoute(next);
    setMoreOpen(false);
  };

  const openTurbineDetail = (turbineId: string) => {
    setSelectedTurbineId(turbineId);
    navigateTo('turbine-detail');
  };

  const activeTab: PrimaryTab =
    route === 'home'
      ? 'home'
      : route === 'turbines' || route === 'turbine-detail'
      ? 'turbines'
      : route === 'diagnostics'
      ? 'diagnostics'
      : route === 'reports'
      ? 'reports'
      : 'more';

  const handleSelectTab = (tab: PrimaryTab) => {
    if (tab === 'more') {
      setMoreOpen((v) => !v);
      return;
    }
    setMoreOpen(false);
    navigateTo(tab);
  };

  const selectedPlant = PLANTS.find((p) => p.id === selectedPlantId) || PLANTS[0];
  const selectedTurbine = turbines.find((t) => t.id === selectedTurbineId) || turbines[0];
  const livePowerMW = turbines.reduce((sum, t) => sum + t.powerMW, 0);
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <PhoneFrame showStatusBar={true}>
      <ToastBanner message={toast?.message || null} type={toast?.type} />

      {route === 'splash' ? (
        <SplashScreen onEnterDemo={() => setRoute('home')} />
      ) : (
        <>
          <div className="relative flex flex-1 flex-col overflow-hidden">
            {route === 'home' && (
              <DashboardScreen
                plants={PLANTS}
                selectedPlant={selectedPlant}
                onSelectPlant={(id) => {
                  setSelectedPlantId(id);
                  const plant = PLANTS.find((p) => p.id === id);
                  if (plant) showToast(`Switched to ${plant.name}`, 'info');
                }}
                turbines={turbines}
                alerts={alerts}
                tasks={tasks}
                livePowerMW={livePowerMW}
                onOpenTurbine={openTurbineDetail}
                onNavigate={navigateTo}
              />
            )}

            {route === 'turbines' && (
              <TurbinesScreen turbines={turbines} onSelectTurbine={openTurbineDetail} />
            )}

            {route === 'turbine-detail' && (
              <TurbineDetailScreen
                turbine={selectedTurbine}
                onBack={() => navigateTo(previousRoute === 'turbine-detail' ? 'turbines' : previousRoute)}
                onOpenDiagnostics={() => navigateTo('diagnostics')}
                onOpenMaintenance={() => navigateTo('maintenance')}
              />
            )}

            {route === 'diagnostics' && (
              <DiagnosticsScreen
                turbines={turbines}
                alerts={alerts}
                onOpenTurbine={openTurbineDetail}
                onScheduleMaintenance={() => navigateTo('maintenance')}
              />
            )}

            {route === 'reports' && <ReportsScreen onShowToast={showToast} />}

            {route === 'maintenance' && (
              <MaintenanceScreen
                tasks={tasks}
                onAddTask={(newTask) => {
                  const id = `MNT-${210 + tasks.length}`;
                  setTasks((prev) => [{ ...newTask, id }, ...prev]);
                  showToast(`Scheduled ${newTask.title}`, 'success');
                }}
                onUpdateStatus={(taskId, status: MaintenanceStatus) => {
                  setTasks((prev) =>
                    prev.map((t) => (t.id === taskId ? { ...t, status } : t))
                  );
                  showToast(`Work order ${taskId} marked ${status}`, 'success');
                }}
                onBack={() => navigateTo('home')}
              />
            )}

            {route === 'alerts' && (
              <AlertsScreen
                alerts={alerts}
                onMarkRead={(id) => {
                  setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
                }}
                onDismiss={(id) => {
                  setAlerts((prev) => prev.filter((a) => a.id !== id));
                  showToast('Notification dismissed', 'info');
                }}
                onOpenTurbine={openTurbineDetail}
                onBack={() => navigateTo('home')}
              />
            )}

            {route === 'efficiency' && (
              <EfficiencyScreen
                turbines={turbines}
                onOpenTurbine={openTurbineDetail}
                onBack={() => navigateTo('home')}
              />
            )}

            {route === 'integration' && (
              <IntegrationScreen
                integrations={integrations}
                onSyncIntegration={(id) => {
                  setIntegrations((prev) =>
                    prev.map((i) =>
                      i.id === id ? { ...i, lastSync: 'Just now', status: 'Connected' } : i
                    )
                  );
                  showToast('Simulated plant telemetry synchronized', 'success');
                }}
                onUpdateIntegration={(id, pollingIntervalSec, autoSync) => {
                  setIntegrations((prev) =>
                    prev.map((i) =>
                      i.id === id ? { ...i, pollingIntervalSec, autoSync } : i
                    )
                  );
                  showToast('Integration settings saved', 'success');
                }}
                onBack={() => navigateTo('home')}
              />
            )}

            {route === 'settings' && (
              <SettingsScreen
                selectedPlantName={selectedPlant.name}
                onBack={() => navigateTo('home')}
                onShowToast={showToast}
                onExitToSplash={() => {
                  setMoreOpen(false);
                  setRoute('splash');
                }}
              />
            )}

            <MoreSheet
              open={moreOpen}
              currentRoute={route}
              unreadAlertsCount={unreadAlertsCount}
              onClose={() => setMoreOpen(false)}
              onNavigate={navigateTo}
            />
          </div>

          <BottomNav
            activeTab={activeTab}
            unreadAlertsCount={unreadAlertsCount}
            onSelectTab={handleSelectTab}
          />
        </>
      )}
    </PhoneFrame>
  );
}

export default App;
