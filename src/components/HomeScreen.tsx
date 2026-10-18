import React from 'react';
import { 
  Phone, MessageSquare, Calendar, Settings, Music, Camera, 
  FileText, CheckSquare, Map, Clock, CloudSun, Shield, Sparkles, Battery 
} from 'lucide-react';
import { AppId, PhoneSettings, CalendarEvent } from '../types/phone';

interface HomeScreenProps {
  onOpenApp: (appId: AppId) => void;
  unreadMessagesCount: number;
  upcomingEvent: CalendarEvent | null;
  settings: PhoneSettings;
  onInvokeJarvis: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenApp,
  unreadMessagesCount,
  upcomingEvent,
  settings,
  onInvokeJarvis,
}) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const appIcons: Array<{
    id: AppId;
    name: string;
    icon: React.ElementType;
    bgGradient: string;
    badge?: number | string;
  }> = [
    { id: 'phone', name: 'Phone', icon: Phone, bgGradient: 'from-emerald-500 to-green-600' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, bgGradient: 'from-blue-500 to-cyan-600', badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { id: 'calendar', name: 'Calendar', icon: Calendar, bgGradient: 'from-rose-500 to-red-600' },
    { id: 'settings', name: 'Settings', icon: Settings, bgGradient: 'from-neutral-700 to-neutral-800' },
    { id: 'music', name: 'Music', icon: Music, bgGradient: 'from-pink-500 to-rose-600' },
    { id: 'camera', name: 'Camera', icon: Camera, bgGradient: 'from-neutral-800 to-neutral-900' },
    { id: 'notes', name: 'Notes', icon: FileText, bgGradient: 'from-amber-400 to-yellow-600' },
    { id: 'reminders', name: 'Reminders', icon: CheckSquare, bgGradient: 'from-indigo-500 to-blue-600' },
    { id: 'maps', name: 'Maps', icon: Map, bgGradient: 'from-teal-500 to-emerald-600' },
    { id: 'clock', name: 'Clock', icon: Clock, bgGradient: 'from-orange-500 to-amber-600' },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-4 relative select-none">
      {/* Top Widgets Grid */}
      <div className="space-y-3 pt-2">
        {/* Weather & Clock Widget */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Live Clock & Date */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col justify-between shadow-lg">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{currentDate}</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white my-1">{currentTime}</div>
            <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Jarvis Sync OK</span>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-neutral-300">
              <span className="text-[10px] font-mono uppercase tracking-wider">San Francisco</span>
              <CloudSun className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white my-1">72°</div>
            <div className="text-[10px] text-neutral-400 truncate">Partly Cloudy • H:76° L:58°</div>
          </div>
        </div>

        {/* Jarvis Status Card */}
        <div 
          onClick={onInvokeJarvis}
          className="bg-gradient-to-r from-cyan-950/60 via-black/50 to-indigo-950/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3 cursor-pointer hover:border-cyan-400/60 transition-all shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>JARVIS AI MEDIATOR</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-cyan-300/80 font-mono">
                  Say "Hey Jarvis" or tap to order
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              ONLINE
            </span>
          </div>

          {upcomingEvent && (
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300">
              <span className="truncate max-w-[170px] text-neutral-300">
                Next: <strong className="text-white font-medium">{upcomingEvent.title}</strong>
              </span>
              <span className="font-mono text-cyan-300 text-[10px] flex-shrink-0">{upcomingEvent.time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Apps Grid (4 columns) */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 my-auto px-1 py-2">
        {appIcons.map((app) => {
          const IconComp = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center group transition-transform active:scale-90"
            >
              <div className="relative">
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white shadow-xl shadow-black/40 border border-white/15 transition-all group-hover:scale-105 group-hover:brightness-110`}>
                  <IconComp className="w-6 h-6 drop-shadow" />
                </div>
                {app.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold font-mono flex items-center justify-center border-2 border-black">
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-white/90 tracking-tight mt-1.5 truncate max-w-[58px] drop-shadow-md">
                {app.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Frosted Glass Dock */}
      <div className="bg-white/15 backdrop-blur-2xl border border-white/20 rounded-3xl p-2.5 px-4 shadow-2xl flex items-center justify-between mb-1">
        {appIcons.slice(0, 4).map((app) => {
          const IconComp = app.icon;
          return (
            <button
              key={`dock-${app.id}`}
              onClick={() => onOpenApp(app.id)}
              className="relative transition-transform active:scale-90"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.bgGradient} flex items-center justify-center text-white shadow-lg border border-white/20`}>
                <IconComp className="w-5 h-5 drop-shadow" />
              </div>
              {app.badge !== undefined && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold font-mono flex items-center justify-center border-2 border-black">
                  {app.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
