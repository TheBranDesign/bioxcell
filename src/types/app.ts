export type PrimaryTab = 'home' | 'turbines' | 'diagnostics' | 'reports' | 'more';

export type ScreenRoute =
  | 'splash'
  | 'home'
  | 'turbines'
  | 'turbine-detail'
  | 'diagnostics'
  | 'reports'
  | 'maintenance'
  | 'alerts'
  | 'efficiency'
  | 'integration'
  | 'settings';

export type TurbineStatus = 'Optimal' | 'Advisory' | 'Warning' | 'Offline';

export type TimeRange = '1H' | '6H' | '24H' | '7D';

export type ReportRange = 'Today' | 'This Week' | 'This Month' | 'Custom Range';

export interface TurbineMetricPoint {
  time: string;
  power: number;
  efficiency: number;
  vibration: number;
  bearingTemp: number;
}

export interface Turbine {
  id: string;
  name: string;
  model: string;
  serial: string;
  status: TurbineStatus;
  powerMW: number;
  capacityMW: number;
  rpm: number;
  exhaustTempC: number;
  bearingTempC: number;
  vibrationMmS: number;
  pressureBar: number;
  efficiencyPct: number;
  healthScore: number;
  operatingHours: number;
  lastService: string;
  history: Record<TimeRange, TurbineMetricPoint[]>;
}

export type AlertSeverity = 'Critical' | 'Warning' | 'Info' | 'Maintenance';

export interface AppAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: 'Equipment Health' | 'Maintenance' | 'Power Anomaly' | 'System';
  turbineId?: string;
  timestamp: string;
  read: boolean;
  recommendedAction: string;
  metricLabel?: string;
  metricValue?: string;
}

export type MaintenanceStatus = 'Upcoming' | 'Scheduled' | 'Preventive' | 'Completed' | 'Overdue';
export type MaintenancePriority = 'High' | 'Medium' | 'Low';

export interface MaintenanceTask {
  id: string;
  title: string;
  turbineId: string;
  dueDate: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignee: string;
  estimatedHours: number;
  notes: string;
}

export interface PlantIntegrationItem {
  id: string;
  name: string;
  category:
    | 'SCADA Systems'
    | 'Distributed Control Systems (DCS)'
    | 'Plant Management Systems'
    | 'Equipment Sensors'
    | 'Industrial IoT Gateways';
  protocol: string;
  status: 'Connected' | 'Standby' | 'Degraded';
  lastSync: string;
  transmissionRate: string;
  connectedEquipment: string[];
  healthPct: number;
  pollingIntervalSec: number;
  autoSync: boolean;
  endpoint: string;
}

export interface PlantInfo {
  id: string;
  name: string;
  location: string;
  capacityMW: number;
  gridFrequencyHz: number;
  status: 'ONLINE • OPTIMAL' | 'ONLINE • ADVISORY';
}
