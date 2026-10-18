// Speech Recognition and Text-To-Speech engine for Jarvis Voice Assistant

export interface SpeechEngineCallbacks {
  onWakeWordDetected?: () => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: 'idle' | 'listening' | 'wake_detected' | 'processing' | 'speaking') => void;
}

export class JarvisSpeechEngine {
  private recognition: any = null;
  private isContinuous = false;
  private isListening = false;
  private callbacks: SpeechEngineCallbacks = {};
  private voices: SpeechSynthesisVoice[] = [];
  private voiceStyle: 'jarvis-british' | 'siri-modern' | 'cyber-core' = 'jarvis-british';

  constructor(callbacks: SpeechEngineCallbacks = {}) {
    this.callbacks = callbacks;
    this.initSpeechSynthesis();
  }

  public updateCallbacks(callbacks: Partial<SpeechEngineCallbacks>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public setVoiceStyle(style: 'jarvis-british' | 'siri-modern' | 'cyber-core') {
    this.voiceStyle = style;
  }

  private initSpeechSynthesis() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  // Get preferred voice according to style
  private getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }

    if (!this.voices.length) return null;

    if (this.voiceStyle === 'jarvis-british') {
      // Look for British English male voices like Daniel, George, Arthur, or en-GB
      const gbMale = this.voices.find(v => 
        (v.lang.includes('en-GB') || v.lang.includes('en_GB')) && 
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('oliver'))
      );
      if (gbMale) return gbMale;

      const gbGeneral = this.voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
      if (gbGeneral) return gbGeneral;
    }

    // Modern Siri-like voice
    const naturalVoice = this.voices.find(v => 
      v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Samantha') || v.name.includes('Google US English')
    );
    if (naturalVoice) return naturalVoice;

    // Default english voice
    const anyEnglish = this.voices.find(v => v.lang.startsWith('en'));
    return anyEnglish || this.voices[0] || null;
  }

  // Speak text using SpeechSynthesis
  public speak(text: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        onEnd?.();
        resolve();
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.getBestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      if (this.voiceStyle === 'jarvis-british') {
        utterance.pitch = 0.95;
        utterance.rate = 1.05;
      } else if (this.voiceStyle === 'cyber-core') {
        utterance.pitch = 0.88;
        utterance.rate = 1.1;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      this.callbacks.onStatusChange?.('speaking');

      utterance.onend = () => {
        this.callbacks.onStatusChange?.('idle');
        onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.callbacks.onStatusChange?.('idle');
        onEnd?.();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // Stop speaking
  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.callbacks.onStatusChange?.('idle');
    }
  }

  // Check if browser supports Web Speech Recognition
  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  // Start continuous listening for "Hey Jarvis" wake word
  public startListening(continuous = true) {
    if (this.isListening) return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      this.callbacks.onError?.('Speech recognition is not supported in this browser. You can type commands or use the interactive shortcuts!');
      return;
    }

    try {
      this.isContinuous = continuous;
      this.recognition = new SpeechRec();
      this.recognition.continuous = continuous;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStatusChange?.('listening');
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();

        // Check for wake word trigger
        const wakeWordPattern = /(?:hey|ok|hello|hi)?\s*jarvis/i;
        if (wakeWordPattern.test(currentText)) {
          this.callbacks.onWakeWordDetected?.();
        }

        if (finalTranscript) {
          this.callbacks.onTranscript?.(finalTranscript.trim(), true);
        } else if (interimTranscript) {
          this.callbacks.onTranscript?.(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
        }
        if (event.error === 'not-allowed') {
          this.callbacks.onError?.('Microphone access was denied. Please allow microphone permissions to use voice activation.');
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // If continuous wake-word mode is active, auto-restart
        if (this.isContinuous) {
          setTimeout(() => {
            if (this.isContinuous && !this.isListening) {
              try {
                this.recognition?.start();
              } catch (e) {
                // Ignore restart race condition
              }
            }
          }, 400);
        } else {
          this.callbacks.onStatusChange?.('idle');
        }
      };

      this.recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      this.callbacks.onError?.('Could not activate speech recognition.');
    }
  }

  public stopListening() {
    this.isContinuous = false;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.recognition = null;
    }
    this.callbacks.onStatusChange?.('idle');
  }

  public getIsListening() {
    return this.isListening;
  }
}
