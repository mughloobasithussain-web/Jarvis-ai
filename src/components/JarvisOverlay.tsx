import { Sparkles, Mic, MicOff, X, CheckCircle2, Clock, ArrowRight, Volume2, ShieldCheck, Zap, BrainCircuit, Tag } from 'lucide-react';
import { JarvisExecutionStep, NLUResult } from '../types/phone';

interface JarvisOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'idle' | 'listening' | 'wake_detected' | 'processing' | 'speaking';
  transcript: string;
  response: string;
  taskTitle: string;
  steps: JarvisExecutionStep[];
  nluResult?: NLUResult | null;
  onTriggerExample: (cmd: string) => void;
  onToggleMic: () => void;
  isMicActive: boolean;
}

export const JarvisOverlay: React.FC<JarvisOverlayProps> = ({
  isOpen,
  onClose,
  status,
  transcript,
  response,
  taskTitle,
  steps,
  nluResult,
  onTriggerExample,
  onToggleMic,
  isMicActive,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col justify-between p-4 text-white animate-in fade-in duration-200 overflow-hidden">
      {/* Background holographic glow effects */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400">
            JARVIS // PROTOCOL
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-neutral-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Center Area: Transcript & Multi-Step Execution Pipeline */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-sm mx-auto w-full px-2">
        {/* Glowing Siri/Jarvis Hologram Orb */}
        <div className="relative w-32 h-32 my-3 flex items-center justify-center">
          {/* Animated concentric rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-dashed border-fuchsia-500/30 animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/30 to-fuchsia-600/20 blur-md animate-pulse" />

          {/* Core sphere with fluid gradient */}
          <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-0.5 shadow-[0_0_35px_rgba(34,211,238,0.5)] transition-transform duration-300 ${status === 'listening' ? 'scale-110' : status === 'speaking' ? 'scale-105' : 'scale-100'}`}>
            <div className="w-full h-full rounded-full bg-neutral-950/90 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
              {status === 'speaking' ? (
                <Volume2 className="w-8 h-8 text-cyan-300 animate-pulse relative z-10" />
              ) : status === 'processing' ? (
                <Zap className="w-8 h-8 text-amber-300 animate-bounce relative z-10" />
              ) : (
                <Sparkles className="w-8 h-8 text-cyan-300 relative z-10" />
              )}
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-300/80 mb-2">
          {status === 'listening' && 'Listening for command...'}
          {status === 'wake_detected' && 'Wake word detected!'}
          {status === 'processing' && 'Processing phone order...'}
          {status === 'speaking' && 'Jarvis executing & responding'}
          {status === 'idle' && 'Awaiting order ("Hey Jarvis")'}
        </div>

        {/* User transcript */}
        {transcript ? (
          <div className="text-lg font-medium text-white mb-2 max-h-20 overflow-y-auto px-2 leading-snug">
            "{transcript}"
          </div>
        ) : (
          <div className="text-sm text-neutral-400 mb-2 italic">
            Say <span className="text-cyan-300 font-semibold">"Hey Jarvis"</span> followed by any order
          </div>
        )}

        {/* Jarvis spoken response bubble */}
        {response && (
          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-100 text-left my-2 shadow-lg backdrop-blur-md w-full">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>JARVIS SYSTEM REPLY</span>
            </div>
            <p className="leading-relaxed">{response}</p>
          </div>
        )}

        {/* NLU & Contextual Coreference Inspector */}
        {nluResult && (
          <div className="w-full bg-neutral-900/90 border border-cyan-500/30 rounded-xl p-2.5 my-1.5 text-left text-xs shadow-md">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-800 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                <span>NLU INTENT: {nluResult.intent}</span>
              </span>
              <span className="text-neutral-400 font-mono">
                {Math.round((nluResult.confidence || 0.95) * 100)}% match
              </span>
            </div>

            {/* Anaphora / Pronoun Coreference Resolution Notice */}
            {nluResult.anaphoraResolution && (
              <div className="px-2 py-1 mb-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/40 text-[10px] text-indigo-200 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                <span>Context: {nluResult.anaphoraResolution}</span>
              </div>
            )}

            {/* Extracted Entities Chips */}
            <div className="flex flex-wrap gap-1">
              {Object.entries(nluResult.entities || {}).map(([key, val]) => {
                if (!val || typeof val === 'object') return null;
                return (
                  <span
                    key={key}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300"
                  >
                    <span className="text-neutral-500 mr-1">{key}:</span>
                    <strong className="text-cyan-300">{String(val)}</strong>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Multi-step execution pipeline */}
        {steps && steps.length > 0 && (
          <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 my-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2 pb-1 border-b border-neutral-800">
              <span className="font-semibold text-neutral-200">{taskTitle || 'Multi-Step Routine'}</span>
              <span className="text-cyan-400">
                {steps.filter(s => s.status === 'completed').length}/{steps.length} Steps
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className={`flex items-center gap-2 p-1.5 rounded-lg text-xs transition-colors ${
                    step.status === 'completed'
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/40'
                      : step.status === 'executing'
                      ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-700/50 animate-pulse'
                      : 'bg-neutral-800/40 text-neutral-400'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : step.status === 'executing' ? (
                      <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400">#{idx + 1}</span>
                  <span className="truncate">{step.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Suggestions and Action Triggers */}
      <div className="relative z-10 pt-2 border-t border-neutral-800/80">
        <div className="text-[10px] font-mono uppercase text-neutral-400 mb-1.5 text-left flex items-center justify-between">
          <span>Quick Voice Orders</span>
          <span className="text-cyan-400">Tap to test</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onTriggerExample('Morning routine: turn off DND, set brightness to 85%, play focus music, and show calendar')}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] text-neutral-200 transition-colors flex items-center gap-1"
          >
            <span>🌅 Morning Routine</span>
          </button>
          <button
            onClick={() => onTriggerExample('Call Sarah Connor on speaker')}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] text-neutral-200 transition-colors flex items-center gap-1"
          >
            <span>📞 Call Sarah</span>
          </button>
          <button
            onClick={() => onTriggerExample('Draft a message to Alex saying I will arrive at the lab in 10 minutes')}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] text-neutral-200 transition-colors flex items-center gap-1"
          >
            <span>💬 Text Alex</span>
          </button>
          <button
            onClick={() => onTriggerExample('Schedule a meeting tomorrow at 3 PM called Executive Sync')}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] text-neutral-200 transition-colors flex items-center gap-1"
          >
            <span>📅 Schedule Sync</span>
          </button>
          <button
            onClick={() => onTriggerExample('Turn on flashlight and open Camera')}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] text-neutral-200 transition-colors flex items-center gap-1"
          >
            <span>🔦 Torch & Camera</span>
          </button>
        </div>

        {/* Bottom Mic Toggle Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-neutral-400">
            {isMicActive ? (
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Mic Listening
              </span>
            ) : (
              <span className="text-neutral-500 font-mono">Mic Inactive</span>
            )}
          </div>
          <button
            onClick={onToggleMic}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              isMicActive
                ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                : 'bg-cyan-500 text-neutral-950 font-bold hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            }`}
          >
            {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isMicActive ? 'Stop Listening' : 'Hold to Speak'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
