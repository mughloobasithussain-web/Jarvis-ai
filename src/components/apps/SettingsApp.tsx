import React from 'react';
import { Wifi, Bluetooth, Moon, Sun, Volume2, Flashlight, Battery, Shield, Radio, Mic, Sparkles, Palette } from 'lucide-react';
import { PhoneSettings } from '../../types/phone';

interface SettingsAppProps {
  settings: PhoneSettings;
  onUpdateSettings: (newSettings: Partial<PhoneSettings>) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs text-neutral-400 font-mono">Jarvis Core Device Config</p>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Network & Connectivity */}
        <div className="bg-neutral-900/80 rounded-2xl p-3 border border-neutral-800 space-y-3">
          <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
            Connectivity
          </div>

          {/* Wi-Fi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Wi-Fi</div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {settings.wifi ? settings.wifiSsid : 'Disconnected'}
                </div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ wifi: !settings.wifi })}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${settings.wifi ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${settings.wifi ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Bluetooth */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <Bluetooth className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Bluetooth</div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {settings.bluetooth ? settings.bluetoothDevice : 'Off'}
                </div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ bluetooth: !settings.bluetooth })}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${settings.bluetooth ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${settings.bluetooth ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Cellular */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Cellular Data (5G)</div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {settings.cellular ? 'Verizon / StarkNet Active' : 'Off'}
                </div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ cellular: !settings.cellular })}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${settings.cellular ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${settings.cellular ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Device Hardware Controls */}
        <div className="bg-neutral-900/80 rounded-2xl p-3 border border-neutral-800 space-y-3">
          <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
            Hardware & Focus
          </div>

          {/* Flashlight */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${settings.flashlight ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                <Flashlight className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-white">Torch / Flashlight</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ flashlight: !settings.flashlight })}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${settings.flashlight ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${settings.flashlight ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Do Not Disturb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${settings.dnd ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Do Not Disturb</div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {settings.dnd ? 'Silence Calls & Notifications' : 'Standard'}
                </div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ dnd: !settings.dnd })}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${settings.dnd ? 'bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.3)]' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${settings.dnd ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Low Power Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${settings.lowPowerMode ? 'bg-amber-600 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                <Battery className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-white">Low Power Mode</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ lowPowerMode: !settings.lowPowerMode })}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${settings.lowPowerMode ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${settings.lowPowerMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Sliders for Brightness & Volume */}
        <div className="bg-neutral-900/80 rounded-2xl p-3 border border-neutral-800 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Screen Brightness</span>
              </span>
              <span className="font-mono text-cyan-400">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.brightness}
              onChange={(e) => onUpdateSettings({ brightness: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Master Volume</span>
              </span>
              <span className="font-mono text-cyan-400">{settings.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Jarvis Assistant Configuration */}
        <div className="bg-gradient-to-br from-cyan-950/40 via-neutral-900 to-indigo-950/30 rounded-2xl p-3 border border-cyan-500/30 space-y-3">
          <div className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Jarvis AI Voice Protocol</span>
          </div>

          {/* Wake Word Always Listening */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Wake Word ("Hey Jarvis")</div>
              <div className="text-[10px] text-neutral-400">Continuous voice mediator</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ wakeWordEnabled: !settings.wakeWordEnabled })}
              className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${settings.wakeWordEnabled ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transform transition-transform duration-300 ease-in-out ${settings.wakeWordEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Voice Personality */}
          <div>
            <div className="text-xs font-semibold text-white mb-1.5">Voice Style</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'jarvis-british', label: 'Jarvis (UK)' },
                { id: 'siri-modern', label: 'Siri Style' },
                { id: 'cyber-core', label: 'Cyber Core' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => onUpdateSettings({ voiceStyle: v.id as any })}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-mono border transition-all ${
                    settings.voiceStyle === v.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
