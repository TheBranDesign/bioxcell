import React, { useState } from 'react';
import { Plus, Calendar, Wrench, CheckCircle2, X } from 'lucide-react';
import type { MaintenancePriority, MaintenanceStatus, MaintenanceTask } from '../types/app';
import { ScreenHeader, StatusBadge } from '../components/UiPrimitives';

interface MaintenanceScreenProps {
  tasks: MaintenanceTask[];
  onAddTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  onUpdateStatus: (taskId: string, status: MaintenanceStatus) => void;
  onBack: () => void;
}

const STATUS_TABS: ('All' | MaintenanceStatus)[] = [
  'All',
  'Upcoming',
  'Scheduled',
  'Preventive',
  'Overdue',
  'Completed',
];

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  tasks,
  onAddTask,
  onUpdateStatus,
  onBack,
}) => {
  const [tab, setTab] = useState<'All' | MaintenanceStatus>('All');
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Task Form State
  const [title, setTitle] = useState('');
  const [turbineId, setTurbineId] = useState('T-02');
  const [dueDate, setDueDate] = useState('2026-12-05');
  const [priority, setPriority] = useState<MaintenancePriority>('Medium');
  const [status, setStatus] = useState<MaintenanceStatus>('Scheduled');
  const [notes, setNotes] = useState('');

  const filtered = tab === 'All' ? tasks : tasks.filter((t) => t.status === tab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: `Turbine ${turbineId} – ${title.trim()}`,
      turbineId,
      dueDate,
      priority,
      status,
      assignee: 'Alex Mercer (Assigned)',
      estimatedHours: 4,
      notes: notes.trim() || 'Scheduled via BioXcell Pulse mobile console.',
    });
    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0D1B2A] animate-screen-in">
      <ScreenHeader
        title="Maintenance Schedule"
        subtitle={`${tasks.filter((t) => t.status !== 'Completed').length} Open Work Orders`}
        onBack={onBack}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#20C5E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#081525] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        }
      />

      {/* Status Filter Pills */}
      <div className="shrink-0 flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition cursor-pointer ${
              tab === s ? 'bg-[#20C5E8] text-[#081525]' : 'bg-[#13263A] text-[#91A4B8]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="mobile-scroll flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {filtered.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => setSelectedTask(task)}
            className="w-full rounded-2xl border border-white/10 bg-[#13263A] p-3.5 text-left transition hover:border-[#20C5E8]/40 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={task.status} />
                  <span
                    className={`text-[10px] font-semibold ${
                      task.priority === 'High'
                        ? 'text-[#EF5350]'
                        : task.priority === 'Medium'
                        ? 'text-[#F5A623]'
                        : 'text-[#20C997]'
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                </div>
                <h3 className="mt-1.5 text-xs font-bold text-[#F3F7FC]">{task.title}</h3>
              </div>
              <Wrench className="h-4 w-4 shrink-0 text-[#91A4B8]" />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#91A4B8]">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#20C5E8]" />
                Due: {task.dueDate}
              </span>
              <span className="font-mono-num text-[10px]">{task.id}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="w-full rounded-t-3xl border-t border-white/15 bg-[#0D1B2A] p-4 pb-6 shadow-2xl animate-screen-in">
            <div className="mb-3 flex items-center justify-between">
              <StatusBadge status={selectedTask.status} />
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                aria-label="Close task detail"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13263A] text-[#91A4B8] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-sm font-bold text-[#F3F7FC]">{selectedTask.title}</h3>
            <p className="mt-1 text-xs text-[#91A4B8]">{selectedTask.notes}</p>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-[#13263A] p-3 text-[11px]">
              <div>
                <span className="text-[#91A4B8]">Due Date</span>
                <div className="font-semibold text-[#F3F7FC]">{selectedTask.dueDate}</div>
              </div>
              <div>
                <span className="text-[#91A4B8]">Priority</span>
                <div className="font-semibold text-[#F3F7FC]">{selectedTask.priority}</div>
              </div>
              <div>
                <span className="text-[#91A4B8]">Assignee</span>
                <div className="font-semibold text-[#F3F7FC]">{selectedTask.assignee}</div>
              </div>
              <div>
                <span className="text-[#91A4B8]">Est. Duration</span>
                <div className="font-semibold text-[#F3F7FC]">{selectedTask.estimatedHours} hrs</div>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#91A4B8]">
                Update Status
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(['Upcoming', 'Scheduled', 'Preventive', 'Completed'] as MaintenanceStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      onUpdateStatus(selectedTask.id, st);
                      setSelectedTask({ ...selectedTask, status: st });
                    }}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      selectedTask.status === st
                        ? 'bg-[#20C5E8] text-[#081525]'
                        : 'bg-[#13263A] text-[#91A4B8]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {selectedTask.status !== 'Completed' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(selectedTask.id, 'Completed');
                  setSelectedTask(null);
                }}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#20C997] py-2.5 text-xs font-bold text-[#081525] cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Task as Completed
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Maintenance Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/65 backdrop-blur-[2px]">
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-t-3xl border-t border-white/15 bg-[#0D1B2A] p-4 pb-6 shadow-2xl space-y-3 animate-screen-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F3F7FC]">Schedule Maintenance Task</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13263A] text-[#91A4B8] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-[#91A4B8]">Task Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Fuel Nozzle Calibration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#13263A] px-3 py-2 text-xs text-[#F3F7FC] placeholder:text-[#91A4B8]/50 focus:border-[#20C5E8] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-[#91A4B8]">Equipment</label>
                <select
                  value={turbineId}
                  onChange={(e) => setTurbineId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#13263A] px-2.5 py-2 text-xs text-[#F3F7FC]"
                >
                  <option value="T-01">Turbine T-01</option>
                  <option value="T-02">Turbine T-02</option>
                  <option value="T-03">Turbine T-03</option>
                  <option value="T-04">Turbine T-04</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-[#91A4B8]">Target Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#13263A] px-2.5 py-2 text-xs text-[#F3F7FC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-[#91A4B8]">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#13263A] px-2.5 py-2 text-xs text-[#F3F7FC]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-[#91A4B8]">Category</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#13263A] px-2.5 py-2 text-xs text-[#F3F7FC]"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Preventive">Preventive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#91A4B8]">Engineering Notes</label>
              <textarea
                rows={2}
                placeholder="Optional inspection checklist or permit notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#13263A] px-3 py-2 text-xs text-[#F3F7FC] placeholder:text-[#91A4B8]/50 focus:border-[#20C5E8] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#20C5E8] py-2.5 text-xs font-bold text-[#081525] cursor-pointer"
            >
              Create Work Order
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
