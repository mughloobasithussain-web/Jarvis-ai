import React from 'react';
import { Bell, Trash2, Volume2, X, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { PhoneNotification, AppId } from '../types/phone';

interface NotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PhoneNotification[];
  onClearAll: () => void;
  onReadAloud: () => void;
  onOpenApp: (appId: AppId) => void;
}

export const NotificationShade: React.FC<NotificationShadeProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onReadAloud,
  onOpenApp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-2xl p-4 text-white flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Notifications ({notifications.length})
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-center">
            <Bell className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs">No pending notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.appId !== 'system') {
                  onOpenApp(notif.appId);
                  onClose();
                }
              }}
              className="p-3 rounded-2xl bg-neutral-900/90 border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                    notif.appId === 'messages' ? 'bg-blue-600' : notif.appId === 'calendar' ? 'bg-red-600' : 'bg-cyan-600'
                  }`}>
                    {notif.appId === 'messages' ? <MessageSquare className="w-3 h-3 text-white" /> : notif.appId === 'calendar' ? <Calendar className="w-3 h-3 text-white" /> : <Sparkles className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs font-bold text-white">{notif.title}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">{notif.time}</span>
              </div>
              <p className="text-xs text-neutral-300 pl-7 leading-relaxed">{notif.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      {notifications.length > 0 && (
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onReadAloud}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 hover:bg-cyan-500/30 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read with Jarvis</span>
          </button>

          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-neutral-300 hover:text-red-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
};
