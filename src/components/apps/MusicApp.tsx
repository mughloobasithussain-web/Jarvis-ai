import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Sparkles, Disc } from 'lucide-react';
import { MusicTrack } from '../../types/phone';

interface MusicAppProps {
  tracks: MusicTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSelectTrack: (index: number) => void;
  onVolumeChange: (vol: number) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  progress,
  volume,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSelectTrack,
  onVolumeChange,
}) => {
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const currentSeconds = Math.floor((progress / 100) * (currentTrack?.duration || 180));
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-sm font-mono uppercase tracking-widest text-cyan-400">Jarvis Audio Lab</h1>
          <p className="text-xs text-neutral-400">Spatial Hi-Fi Engine</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* Album Art & Track Info */}
      <div className="flex flex-col items-center my-auto py-2">
        <div className={`w-44 h-44 rounded-2xl bg-gradient-to-tr ${currentTrack.coverGradient} shadow-2xl flex flex-col items-center justify-center p-4 text-center border border-white/10 relative overflow-hidden transition-transform duration-500 ${isPlaying ? 'scale-100 shadow-cyan-500/20' : 'scale-95 opacity-80'}`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-2 border border-white/20">
              <Disc className="w-6 h-6 text-white" />
            </div>
            <div className="text-[11px] font-mono text-cyan-200 tracking-wider uppercase">
              {currentTrack.album}
            </div>
          </div>
        </div>

        <div className="text-center mt-3 max-w-[240px]">
          <h2 className="text-sm font-bold text-white truncate">{currentTrack.title}</h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[260px] mt-4">
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
            <span>{formatTime(currentSeconds)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-6 mt-3">
          <button
            onClick={onPrevTrack}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
          </button>

          <button
            onClick={onNextTrack}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Playlist Tray */}
      <div className="border-t border-neutral-800 pt-2">
        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1.5">
          Up Next
        </div>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {tracks.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => onSelectTrack(idx)}
              className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                idx === currentTrackIndex ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40' : 'hover:bg-white/5 text-neutral-400'
              }`}
            >
              <span className="truncate max-w-[190px]">{t.title}</span>
              <span className="font-mono text-[10px]">{formatTime(t.duration)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
