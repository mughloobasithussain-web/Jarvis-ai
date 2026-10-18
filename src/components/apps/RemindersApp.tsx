import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Sparkles, AlertCircle, Flag } from 'lucide-react';
import { Reminder } from '../../types/phone';

interface RemindersAppProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (title: string, priority: 'low' | 'medium' | 'high') => void;
}

export const RemindersApp: React.FC<RemindersAppProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReminder(newTitle.trim(), priority);
    setNewTitle('');
  };

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-tight">Reminders</h1>
        <p className="text-xs text-neutral-400 font-mono">
          {reminders.filter(r => !r.completed).length} Incomplete Tasks
        </p>
      </div>

      {/* Reminders List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {reminders.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleReminder(item.id)}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
              item.completed
                ? 'bg-neutral-900/40 border-neutral-800/60 opacity-60'
                : 'bg-neutral-900 border-neutral-800 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  item.completed ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-neutral-600 hover:border-cyan-400'
                }`}
              >
                {item.completed && <CheckSquare className="w-3.5 h-3.5" />}
              </button>
              <div>
                <p className={`text-xs font-medium ${item.completed ? 'line-through text-neutral-500' : 'text-neutral-100'}`}>
                  {item.title}
                </p>
                {item.due && (
                  <span className="text-[10px] text-neutral-400 font-mono">{item.due}</span>
                )}
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase flex items-center gap-1 ${
              item.priority === 'high'
                ? 'text-red-400 bg-red-950/40'
                : item.priority === 'medium'
                ? 'text-amber-400 bg-amber-950/40'
                : 'text-blue-400 bg-blue-950/40'
            }`}>
              <Flag className="w-2.5 h-2.5" />
              {item.priority}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleAdd} className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new reminder or ask Jarvis..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-2 text-[10px] text-neutral-300 font-mono"
        >
          <option value="low">Low</option>
          <option value="medium">Med</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center font-bold"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
