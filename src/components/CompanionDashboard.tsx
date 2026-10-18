import React, { useState } from 'react';
import { 
  Sparkles, Mic, MicOff, Send, Play, Terminal, Volume2, 
  Shield, CheckCircle2, ChevronRight, Zap, RefreshCw, Smartphone, 
  BrainCircuit, ArrowRight, UserCheck, MessageSquare, History, Tag 
} from 'lucide-react';
import { SystemLogEntry, PhoneSettings, NLUResult, JarvisContextState } from '../types/phone';

interface CompanionDashboardProps {
  jarvisStatus: 'idle' | 'listening' | 'wake_detected' | 'processing' | 'speaking';
  isListening: boolean;
  onToggleListening: () => void;
  onSendCommand: (cmd: string) => void;
  logs: SystemLogEntry[];
  settings: PhoneSettings;
  onUpdateSettings: (newSettings: Partial<PhoneSettings>) => void;
  onClearLogs: () => void;
  contextState: JarvisContextState;
  lastNluResult: NLUResult | null;
}

export const CompanionDashboard: React.FC<CompanionDashboardProps> = ({
  jarvisStatus,
  isListening,
  onToggleListening,
  onSendCommand,
  logs,
  settings,
  onUpdateSettings,
  onClearLogs,
  contextState,
  lastNluResult,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'nlu_context' | 'telemetry'>('presets');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    onSendCommand(typedInput.trim());
    setTypedInput('');
  };

  const compoundPresets = [
    {
      title: 'Call John (Context Step 1)',
      prompt: 'Hey Jarvis, call John',
      icon: '📞',
      badge: 'Context Step 1',
    },
    {
      title: 'Message Him (Context Step 2)',
      prompt: 'Message him to say I\'m running late',
      icon: '💬',
      badge: 'Coreference "him"',
    },
    {
      title: 'Morning Routine (Multi-step)',
      prompt: 'Morning routine: turn off DND, set brightness to 85%, play focus music, and show calendar',
      icon: '🌅',
      badge: '4 actions',
    },
    {
      title: 'Night Sleep Protocol (Multi-step)',
      prompt: 'Good night Jarvis: enable Do Not Disturb, set brightness to 15%, pause music, and show alarms',
      icon: '🌙',
      badge: '4 actions',
    },
    {
      title: 'Meeting Prep & Text (Multi-step)',
      prompt: 'I am going into a meeting. Turn on Do Not Disturb, mute volume, and draft message to Sarah saying I am busy until 2 PM',
      icon: '💼',
      badge: '3 actions',
    },
    {
      title: 'Torch ON -> Turn it off',
      prompt: 'Turn on flashlight',
      icon: '🔦',
      badge: 'Hardware',
    },
    {
      title: 'Turn it off (Follow-up)',
      prompt: 'Turn it off',
      icon: '⚡',
      badge: 'Coreference "it"',
    },
    {
      title: 'Schedule Meeting with Elena',
      prompt: 'Schedule a meeting with Elena tomorrow at 3:00 PM called Executive Review',
      icon: '📅',
      badge: 'Calendar',
    },
  ];

  return (
    <div className="w-full max-w-md flex flex-col justify-between bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-white">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">Jarvis NLU Mediator</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-cyan-300 font-mono">
                Contextual Engine & Multi-Turn Reasoning
              </p>
            </div>
          </div>

          {/* Voice Personality Badge */}
          <select
            value={settings.voiceStyle}
            onChange={(e) => onUpdateSettings({ voiceStyle: e.target.value as any })}
            className="bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-xl px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="jarvis-british">UK Jarvis</option>
            <option value="siri-modern">Modern Siri</option>
            <option value="cyber-core">Cyber Core</option>
          </select>
        </div>

        {/* Live Audio / Wake Word Status Banner */}
        <div className={`mt-4 p-3.5 rounded-2xl border transition-all ${
          isListening 
            ? 'bg-cyan-950/40 border-cyan-500/40 shadow-lg shadow-cyan-500/10' 
            : 'bg-neutral-950/60 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleListening}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-cyan-500 text-neutral-950 shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
              </button>

              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{isListening ? 'Voice Hotword Active' : 'Hands-Free Muted'}</span>
                  {isListening && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300">
                      "Hey Jarvis"
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400">
                  {isListening
                    ? 'Say "Hey Jarvis" followed by your order'
                    : 'Click mic to enable continuous voice detection'}
                </p>
              </div>
            </div>

            {/* Live Audio Waves */}
            {isListening && (
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-3.5 bg-fuchsia-400 rounded-full animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* Text Command Input Bar */}
        <form onSubmit={handleSubmit} className="mt-3 relative">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Type an order (e.g. 'Call John', then 'Message him...')..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-4 pr-12 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!typedInput.trim()}
            className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-neutral-950 flex items-center justify-center font-bold transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-1.5 rounded-lg text-[10px] font-mono transition-colors ${
              activeTab === 'presets' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Quick Presets
          </button>
          <button
            onClick={() => setActiveTab('nlu_context')}
            className={`py-1.5 rounded-lg text-[10px] font-mono transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'nlu_context' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3 h-3" />
            <span>NLU Memory</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-1.5 rounded-lg text-[10px] font-mono transition-colors ${
              activeTab === 'telemetry' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Telemetry
          </button>
        </div>

        {/* Main Tab Views */}
        {activeTab === 'presets' && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
              <span>Voice & Follow-up Presets</span>
              <span className="text-[10px] text-cyan-400">1-Tap Execute</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {compoundPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendCommand(item.prompt)}
                  className="p-2.5 rounded-xl bg-neutral-950/70 hover:bg-cyan-950/40 border border-neutral-800/80 hover:border-cyan-500/50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 group-hover:bg-cyan-500/20 text-neutral-400 group-hover:text-cyan-300">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-200 group-hover:text-white line-clamp-1">
                    {item.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nlu_context' && (
          <div className="mt-3 space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {/* Active Context Referent Memory */}
            <div className="bg-neutral-950 border border-cyan-500/30 rounded-xl p-3">
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Active Context Memory</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between bg-neutral-900/80 px-2 py-1.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 text-[10px]">Referent Contact:</span>
                  <span className="font-semibold text-emerald-300">
                    {contextState.lastReferencedContact?.name || <span className="text-neutral-500 italic">None yet</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-neutral-900/80 px-2 py-1.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 text-[10px]">Referent App:</span>
                  <span className="text-indigo-300">
                    {contextState.lastReferencedApp || <span className="text-neutral-500 italic">None</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-neutral-900/80 px-2 py-1.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 text-[10px]">Last Setting:</span>
                  <span className="text-amber-300">
                    {contextState.lastReferencedSetting || <span className="text-neutral-500 italic">None</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Latest NLU Extraction Details */}
            {lastNluResult ? (
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold mb-1.5">
                  <span>LATEST NLU INTENT</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {lastNluResult.intent}
                  </span>
                </div>

                {lastNluResult.anaphoraResolution && (
                  <div className="p-2 mb-2 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-[10px] text-indigo-200 font-mono">
                    💡 {lastNluResult.anaphoraResolution}
                  </div>
                )}

                <div className="text-[10px] font-mono text-neutral-400 mb-1">Identified Entities:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(lastNluResult.entities || {}).map(([k, v]) => {
                    if (!v || typeof v === 'object') return null;
                    return (
                      <span key={k} className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-mono">
                        <span className="text-neutral-500">{k}: </span>
                        <strong className="text-cyan-300">{String(v)}</strong>
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-neutral-500 text-center py-4 bg-neutral-950 rounded-xl border border-neutral-800">
                Issue a voice or text command to view live NLU extraction.
              </div>
            )}
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-neutral-400 mb-2">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Action Telemetry</span>
              </div>
              <button
                onClick={onClearLogs}
                className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 h-44 overflow-y-auto font-mono text-[10px] space-y-1.5">
              {logs.length === 0 ? (
                <div className="text-neutral-600 text-center py-6">
                  Awaiting commands. Speak "Hey Jarvis" or trigger a preset above.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-1.5 text-neutral-300">
                    <span className="text-neutral-600 flex-shrink-0">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'voice'
                        ? 'text-cyan-400 font-semibold'
                        : log.type === 'jarvis'
                        ? 'text-emerald-400'
                        : log.type === 'action'
                        ? 'text-amber-300'
                        : 'text-neutral-400'
                    }>
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer System Status */}
      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Coreference Model: Gemini 3.8 Flash NLU</span>
        </div>
        <span>Context Memory: {contextState.recentInteractions.length} turns</span>
      </div>
    </div>
  );
};
