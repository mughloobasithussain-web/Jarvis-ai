import React from 'react';
import { 
  Wifi, Bluetooth, Radio, Plane, Flashlight, Moon, Battery, 
  Sun, Volume2, Play, Pause, Music, X 
} from 'lucide-react';
import { PhoneSettings, MusicTrack } from '../types/phone';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PhoneSettings;
  onUpdateSettings: (newSettings: Partial<PhoneSettings>) => void;
  currentTrack: MusicTrack | null;
  isPlayingMusic: boolean;
  onTogglePlayMusic: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentTrack,
  isPlayingMusic,
  onTogglePlayMusic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-2xl p-4 text-white flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          Control Center
        </span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Control Cards */}
      <div className="grid grid-cols-2 gap-3 my-auto">
        {/* Network 2x2 Pod */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-3 grid grid-cols-2 gap-2 shadow-xl">
          <button
            onClick={() => onUpdateSettings({ wifi: !settings.wifi })}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
              settings.wifi ? 'bg-blue-600 text-white' : 'bg-white/10 text-neutral-400'
            }`}
          >
            <Wifi className="w-5 h-5" />
          </button>

          <button
            onClick={() => onUpdateSettings({ bluetooth: !settings.bluetooth })}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
              settings.bluetooth ? 'bg-blue-500 text-white' : 'bg-white/10 text-neutral-400'
            }`}
          >
            <Bluetooth className="w-5 h-5" />
          </button>

          <button
            onClick={() => onUpdateSettings({ cellular: !settings.cellular })}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
              settings.cellular ? 'bg-emerald-600 text-white' : 'bg-white/10 text-neutral-400'
            }`}
          >
            <Radio className="w-5 h-5" />
          </button>

          <button
            onClick={() => onUpdateSettings({ airplaneMode: !settings.airplaneMode })}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
              settings.airplaneMode ? 'bg-amber-500 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            <Plane className="w-5 h-5" />
          </button>
        </div>

        {/* Music Player Mini Card */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-3 flex flex-col justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-600 flex items-center justify-center">
              <Music className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="truncate text-xs font-semibold">
              {currentTrack?.title || 'Jarvis Audio'}
            </div>
          </div>

          <div className="text-[10px] text-neutral-400 font-mono truncate">
            {currentTrack?.artist || 'Ambient Stream'}
          </div>

          <div className="flex justify-center">
            <button
              onClick={onTogglePlayMusic}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              {isPlayingMusic ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Flashlight & Do Not Disturb */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSettings({ flashlight: !settings.flashlight })}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              settings.flashlight
                ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900/90 border-white/10 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Flashlight className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Torch</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ dnd: !settings.dnd })}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              settings.dnd
                ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-lg shadow-purple-600/30'
                : 'bg-neutral-900/90 border-white/10 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Moon className="w-5 h-5 mb-1" />
            <span className="text-[10px]">DND</span>
          </button>
        </div>

        {/* Low Power Mode */}
        <button
          onClick={() => onUpdateSettings({ lowPowerMode: !settings.lowPowerMode })}
          className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
            settings.lowPowerMode
              ? 'bg-amber-500 text-black border-amber-400 font-bold'
              : 'bg-neutral-900/90 border-white/10 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Battery className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Low Power</span>
        </button>
      </div>

      {/* Sliders for Brightness & Volume */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        {/* Brightness Slider */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-between h-32">
          <Sun className="w-5 h-5 text-amber-400" />
          <input
            type="range"
            min="10"
            max="100"
            value={settings.brightness}
            onChange={(e) => onUpdateSettings({ brightness: Number(e.target.value) })}
            className="w-20 -rotate-90 my-auto accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-neutral-400">{settings.brightness}%</span>
        </div>

        {/* Volume Slider */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-between h-32">
          <Volume2 className="w-5 h-5 text-cyan-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => onUpdateSettings({ volume: Number(e.target.value) })}
            className="w-20 -rotate-90 my-auto accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-neutral-400">{settings.volume}%</span>
        </div>
      </div>
    </div>
  );
};
