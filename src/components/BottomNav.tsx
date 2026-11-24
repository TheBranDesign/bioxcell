import React from 'react';
import { Home, Cpu, Activity, BarChart3, LayoutGrid } from 'lucide-react';
import type { PrimaryTab } from '../types/app';

interface BottomNavProps {
  activeTab: PrimaryTab;
  unreadAlertsCount: number;
  onSelectTab: (tab: PrimaryTab) => void;
}

const NAV_ITEMS: { id: PrimaryTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'turbines', label: 'Turbines', icon: Cpu },
  { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'more', label: 'More', icon: LayoutGrid },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  unreadAlertsCount,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Primary Navigation"
      className="shrink-0 border-t border-white/10 bg-[#081525]/95 backdrop-blur-md px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-1.5 z-20"
    >
      <div className="grid grid-cols-5 items-center">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`group relative flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#20C5E8]'
                  : 'text-[#91A4B8] hover:text-[#F3F7FC] active:scale-95'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 h-[2px] w-7 rounded-full bg-[#20C5E8] shadow-[0_0_8px_#20C5E8]" />
              )}
              <div className="relative">
                <Icon
                  className={`h-[19px] w-[19px] transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                {item.id === 'more' && unreadAlertsCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#EF5350] px-1 text-[9px] font-bold text-white shadow">
                    {unreadAlertsCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
