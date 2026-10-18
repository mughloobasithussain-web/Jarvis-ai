import React, { useState } from 'react';
import { AlarmClock, Timer, Clock, Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { playStepChime } from '../../utils/soundEffects';

export const ClockApp: React.FC = () => {
  const [alarms, setAlarms] = useState([
    { id: 'a1', time: '06:30 AM', label: 'Morning Cardio & Briefing', active: true },
    { id: 'a2', time: '07:00 AM', label: 'Stark Lab Sync', active: true },
    { id: 'a3', time: '08:00 AM', label: 'Standup Reminder', active: false },
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between p-4 overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Clock & Alarms</h1>
          <p className="text-xs text-neutral-400 font-mono">Jarvis Precision Chronometer</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
          <AlarmClock className="w-4 h-4" />
        </div>
      </div>

      {/* Alarms List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
          >
            <div>
              <div className="text-2xl font-mono font-light text-white tracking-tight">
                {alarm.time}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">{alarm.label}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={alarm.active}
              onClick={() => {
                toggleAlarm(alarm.id);
                playStepChime(alarm.active ? 1 : 2);
              }}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative focus:outline-none ${
                alarm.active 
                  ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                  : 'bg-neutral-800 hover:bg-neutral-700/80'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${
                  alarm.active ? 'translate-x-5' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Summary */}
      <div className="border-t border-neutral-800 pt-3 text-center text-xs text-neutral-500 font-mono">
        Next alarm set for 06:30 AM tomorrow
      </div>
    </div>
  );
};
