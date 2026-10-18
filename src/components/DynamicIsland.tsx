import React from 'react';
import { Phone, Music, Mic, Bell, Sparkles, CheckCircle2, Loader2, Volume2 } from 'lucide-react';
import { ActiveCall, MusicTrack, JarvisExecutionStep } from '../types/phone';

interface DynamicIslandProps {
  jarvisActive: boolean;
  jarvisStatus: 'idle' | 'listening' | 'wake_detected' | 'processing' | 'speaking';
  jarvisTaskTitle?: string;
  activeSteps?: JarvisExecutionStep[];
  activeCall: ActiveCall | null;
  musicPlaying: boolean;
  currentTrack: MusicTrack | null;
  onOpenApp: (appId: any) => void;
  onEndCall: () => void;
  onJarvisClick: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  jarvisActive,
  jarvisStatus,
  jarvisTaskTitle,
  activeSteps,
  activeCall,
  musicPlaying,
  currentTrack,
  onOpenApp,
  onEndCall,
  onJarvisClick,
}) => {
  // If active call is ongoing
  if (activeCall && !jarvisActive) {
    const minutes = Math.floor(activeCall.duration / 60);
    const seconds = activeCall.duration % 60;
    const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
      <div 
        onClick={() => onOpenApp('phone')}
        className="mx-auto w-[200px] h-[36px] bg-black text-white rounded-full flex items-center justify-between px-3 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-800"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
            <Phone className="w-3 h-3" />
          </div>
          <span className="text-xs font-medium truncate max-w-[85px]">{activeCall.contactName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400">{timeFormatted}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEndCall();
            }}
            className="w-5 h-5 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center text-white"
          >
            <Phone className="w-2.5 h-2.5 rotate-[135deg]" />
          </button>
        </div>
      </div>
    );
  }

  // If Jarvis is active or processing
  if (jarvisActive) {
    const isWorking = jarvisStatus === 'processing' || jarvisStatus === 'wake_detected';

    return (
      <div 
        onClick={onJarvisClick}
        className="mx-auto w-[240px] min-h-[38px] bg-neutral-950/95 text-white rounded-2xl flex flex-col justify-center px-3 py-2 cursor-pointer shadow-2xl transition-all duration-300 border border-cyan-500/40 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping" />
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <span className="text-xs font-semibold tracking-wide text-cyan-300">
              JARVIS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {jarvisStatus === 'listening' && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce" />
                <span className="text-[10px] text-cyan-200 font-mono ml-1">Listening</span>
              </div>
            )}
            {isWorking && (
              <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-mono">
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                <span>Executing</span>
              </div>
            )}
            {jarvisStatus === 'speaking' && (
              <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-mono">
                <Volume2 className="w-3 h-3 animate-pulse text-emerald-400" />
                <span>Responding</span>
              </div>
            )}
          </div>
        </div>

        {jarvisTaskTitle && (
          <div className="mt-1 text-[11px] text-neutral-300 truncate font-mono">
            {jarvisTaskTitle}
          </div>
        )}
      </div>
    );
  }

  // If music is playing
  if (musicPlaying && currentTrack) {
    return (
      <div 
        onClick={() => onOpenApp('music')}
        className="mx-auto w-[185px] h-[34px] bg-black text-white rounded-full flex items-center justify-between px-3 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-800"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
            <Music className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs font-medium truncate max-w-[95px] text-neutral-200">
            {currentTrack.title}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
          <span className="w-1 h-3.5 bg-cyan-300 rounded-full animate-pulse [animation-delay:0.2s]" />
          <span className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  // Default compact Dynamic Island camera pill
  return (
    <div 
      onClick={onJarvisClick}
      title="Tap to invoke Jarvis or say 'Hey Jarvis'"
      className="mx-auto w-[120px] h-[30px] bg-black rounded-full flex items-center justify-between px-3 cursor-pointer transition-all duration-300 hover:w-[136px] hover:bg-neutral-900 border border-neutral-800/80 group"
    >
      <div className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
      </div>
      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[10px] font-mono tracking-wider text-neutral-400 group-hover:text-cyan-300">
          JARVIS
        </span>
      </div>
    </div>
  );
};
