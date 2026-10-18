import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Sparkles, Check, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '../../types/phone';

interface CalendarAppProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export const CalendarApp: React.FC<CalendarAppProps> = ({ events, onAddEvent }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [newDate, setNewDate] = useState('Tomorrow');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddEvent({
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      duration: 45,
      location: 'Virtual Conference',
      category: 'work',
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <h1 className="text-xl font-bold tracking-tight">Calendar & Agenda</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Agenda Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Today's Events */}
        <div>
          <div className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Today's Schedule</span>
          </div>

          <div className="space-y-2">
            {events.filter(e => e.date === 'Today').map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white">{evt.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1 text-cyan-300 font-mono">
                        <Clock className="w-3 h-3" />
                        {evt.time} ({evt.duration}m)
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase ${
                    evt.category === 'urgent'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : evt.category === 'health'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {evt.category}
                  </span>
                </div>
                {evt.location && (
                  <div className="mt-2 text-[10px] text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tomorrow & Upcoming */}
        <div>
          <div className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Upcoming / Tomorrow</span>
          </div>

          <div className="space-y-2">
            {events.filter(e => e.date !== 'Today').map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-200">{evt.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400 font-mono">
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-neutral-800 text-neutral-400">
                    {evt.category}
                  </span>
                </div>
                {evt.location && (
                  <div className="mt-2 text-[10px] text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Quick Add Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 p-4 flex flex-col justify-center">
          <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Event</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase">Event Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Sync with Engineering"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Date</label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Friday">Friday</option>
                  <option value="Next Week">Next Week</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
            >
              Add Event
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
