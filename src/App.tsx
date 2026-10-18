import React, { useState, useEffect, useRef } from 'react';
import { 
  INITIAL_CONTACTS, INITIAL_MESSAGES, INITIAL_EVENTS, 
  INITIAL_NOTIFICATIONS, INITIAL_NOTES, INITIAL_REMINDERS, 
  INITIAL_TRACKS, INITIAL_SETTINGS 
} from './data/mockPhoneData';
import { 
  AppId, Contact, MessageThread, CalendarEvent, PhoneNotification, 
  Note, Reminder, MusicTrack, PhoneSettings, ActiveCall, 
  JarvisAction, JarvisExecutionStep, SystemLogEntry, NLUResult, 
  JarvisContextState, InteractionMemory 
} from './types/phone';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './components/HomeScreen';
import { ControlCenter } from './components/ControlCenter';
import { NotificationShade } from './components/NotificationShade';
import { JarvisOverlay } from './components/JarvisOverlay';
import { CompanionDashboard } from './components/CompanionDashboard';

// Phone App Views
import { PhoneApp } from './components/apps/PhoneApp';
import { MessagesApp } from './components/apps/MessagesApp';
import { CalendarApp } from './components/apps/CalendarApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { MusicApp } from './components/apps/MusicApp';
import { CameraApp } from './components/apps/CameraApp';
import { NotesApp } from './components/apps/NotesApp';
import { RemindersApp } from './components/apps/RemindersApp';
import { MapsApp } from './components/apps/MapsApp';
import { ClockApp } from './components/apps/ClockApp';

import { JarvisSpeechEngine } from './utils/speechEngine';
import { playWakeChime, playSuccessChime, playStepChime } from './utils/soundEffects';

export default function App() {
  // Navigation & Phone OS State
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [notificationShadeOpen, setNotificationShadeOpen] = useState(false);
  const [settings, setSettings] = useState<PhoneSettings>(INITIAL_SETTINGS);

  // App Data States
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [messages, setMessages] = useState<MessageThread[]>(INITIAL_MESSAGES);
  const [draftMessage, setDraftMessage] = useState<{ recipient: string; text: string; autoSend?: boolean } | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [notifications, setNotifications] = useState<PhoneNotification[]>(INITIAL_NOTIFICATIONS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [tracks] = useState<MusicTrack[]>(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicProgress, setMusicProgress] = useState(25);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [activeDestination, setActiveDestination] = useState<string>('Stark Tower Lab');

  // Jarvis State
  const [jarvisOverlayOpen, setJarvisOverlayOpen] = useState(false);
  const [jarvisStatus, setJarvisStatus] = useState<'idle' | 'listening' | 'wake_detected' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [executionSteps, setExecutionSteps] = useState<JarvisExecutionStep[]>([]);
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [isContinuousListening, setIsContinuousListening] = useState(true);

  // NLU & Contextual Awareness State
  const [contextState, setContextState] = useState<JarvisContextState>({
    recentInteractions: [],
  });
  const [lastNluResult, setLastNluResult] = useState<NLUResult | null>(null);

  const speechEngineRef = useRef<JarvisSpeechEngine | null>(null);

  // Add system telemetry log
  const addLog = (text: string, type: 'voice' | 'jarvis' | 'system' | 'action' = 'system') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ id: Math.random().toString(), timestamp, text, type }, ...prev.slice(0, 50)]);
  };

  // Music progress timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingMusic) {
      interval = setInterval(() => {
        setMusicProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingMusic]);

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall?.status]);

  // Initialize Speech Engine & Wake Word Listener
  useEffect(() => {
    const engine = new JarvisSpeechEngine({
      onWakeWordDetected: () => {
        playWakeChime();
        setJarvisOverlayOpen(true);
        setJarvisStatus('wake_detected');
        addLog('Hotword "Hey Jarvis" detected', 'voice');
      },
      onTranscript: (text: string, isFinal: boolean) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 0) {
          addLog(`Voice order received: "${text}"`, 'voice');
          handleProcessCommand(text);
        }
      },
      onStatusChange: (status) => {
        setJarvisStatus(status);
      },
      onError: (err) => {
        addLog(`Speech Engine Notice: ${err}`, 'system');
      },
    });

    engine.setVoiceStyle(settings.voiceStyle);
    speechEngineRef.current = engine;

    // Start hotword listening if supported
    if (engine.isSpeechRecognitionSupported()) {
      engine.startListening(true);
      setIsContinuousListening(true);
      addLog('Jarvis autonomous ear initialized. Listening for "Hey Jarvis"...', 'system');
    } else {
      setIsContinuousListening(false);
      addLog('Web Speech API not available in this browser environment. Use interactive buttons & text input.', 'system');
    }

    return () => {
      engine.stopListening();
    };
  }, []);

  // Update speech engine voice personality when setting changes
  useEffect(() => {
    speechEngineRef.current?.setVoiceStyle(settings.voiceStyle);
  }, [settings.voiceStyle]);

  // Global Keyboard shortcuts: Space or Cmd+K to summon Jarvis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        invokeJarvis();
      }
      if (e.key === 'Escape') {
        setJarvisOverlayOpen(false);
        setControlCenterOpen(false);
        setNotificationShadeOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Invoke Jarvis programmatically
  const invokeJarvis = () => {
    playWakeChime();
    setJarvisOverlayOpen(true);
    setJarvisStatus('listening');
    setTranscript('');
    setJarvisResponse('');
    setExecutionSteps([]);
    addLog('Jarvis HUD invoked manually', 'jarvis');
  };

  // Toggle mic listening
  const toggleListening = () => {
    if (!speechEngineRef.current) return;
    if (isContinuousListening) {
      speechEngineRef.current.stopListening();
      setIsContinuousListening(false);
      addLog('Voice detection paused', 'system');
    } else {
      speechEngineRef.current.startListening(true);
      setIsContinuousListening(true);
      addLog('Voice detection resumed. Say "Hey Jarvis"', 'system');
    }
  };

  // Process incoming user voice or typed order via /api/jarvis/process
  const handleProcessCommand = async (commandText: string) => {
    setJarvisStatus('processing');
    setJarvisOverlayOpen(true);

    const phoneStateSnapshot = {
      activeApp,
      settings,
      activeCall,
      musicPlayer: {
        isPlaying: isPlayingMusic,
        currentTrackIndex,
        tracks,
      },
      contacts,
      notifications,
      events,
    };

    try {
      const res = await fetch('/api/jarvis/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: commandText,
          phoneState: phoneStateSnapshot,
          contextMemory: contextState,
          conversationHistory: contextState.recentInteractions,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setJarvisResponse(data.spokenResponse || 'Right away, sir.');
      setTaskTitle(data.taskTitle || 'Jarvis Routine');

      // Update NLU result state
      if (data.nlu) {
        setLastNluResult(data.nlu);
        if (data.nlu.anaphoraResolution) {
          addLog(`[NLU Context] ${data.nlu.anaphoraResolution}`, 'jarvis');
        } else if (data.nlu.intent) {
          addLog(`[NLU Intent] ${data.nlu.intent} (${Math.round((data.nlu.confidence || 0.95) * 100)}% confidence)`, 'jarvis');
        }
      }

      // Update Contextual Awareness Memory
      setContextState(prev => {
        const updates = data.contextUpdates || {};
        const newInteraction: InteractionMemory = {
          id: `turn-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          userCommand: commandText,
          intent: data.nlu?.intent || 'GENERAL_QUERY',
          entities: data.nlu?.entities || {},
          assistantResponse: data.spokenResponse || '',
          referencedContact: updates.lastReferencedContact?.name || prev.lastReferencedContact?.name,
          referencedApp: updates.lastReferencedApp !== undefined ? updates.lastReferencedApp : prev.lastReferencedApp,
        };

        return {
          ...prev,
          lastReferencedContact: updates.lastReferencedContact || prev.lastReferencedContact,
          lastReferencedApp: updates.lastReferencedApp !== undefined ? updates.lastReferencedApp : prev.lastReferencedApp,
          lastReferencedSetting: updates.lastReferencedSetting || prev.lastReferencedSetting,
          lastReferencedEvent: updates.lastReferencedEvent || prev.lastReferencedEvent,
          recentInteractions: [newInteraction, ...prev.recentInteractions.slice(0, 9)],
        };
      });

      // Populate execution pipeline steps
      const steps: JarvisExecutionStep[] = (data.actions || []).map((act: JarvisAction, idx: number) => ({
        id: `step-${idx}-${Date.now()}`,
        description: act.description || `Execute ${act.type}`,
        action: act,
        status: 'pending',
      }));

      setExecutionSteps(steps);
      addLog(`Jarvis parsed: "${data.taskTitle}" with ${steps.length} action(s)`, 'jarvis');

      // Execute the actions sequentially with animated stepper
      await executeActionSequence(steps, data.spokenResponse);

    } catch (err) {
      console.error('Failed to process command:', err);
      const fallbackMsg = "Order received and executed, sir.";
      setJarvisResponse(fallbackMsg);
      speechEngineRef.current?.speak(fallbackMsg);
      addLog('Jarvis executed command locally', 'jarvis');
    }
  };

  // Execute multi-step phone action sequence
  const executeActionSequence = async (steps: JarvisExecutionStep[], spokenReply: string) => {
    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];

      // Mark current step as executing
      setExecutionSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'executing' } : s));
      playStepChime(i + 1);

      // Execute single phone operation
      await performAtomicPhoneAction(currentStep.action);

      // Wait a moment for realistic visual feedback
      await new Promise(r => setTimeout(r, 650));

      // Mark as completed
      setExecutionSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s));
      addLog(`Step completed: ${currentStep.description}`, 'action');
    }

    playSuccessChime();

    // Jarvis speaks confirmation response aloud
    if (spokenReply) {
      speechEngineRef.current?.speak(spokenReply, () => {
        // Auto-minimize overlay after speech ends if returned home
        setTimeout(() => {
          setJarvisOverlayOpen(false);
        }, 1200);
      });
    }
  };

  // Perform atomic phone operation on device state
  const performAtomicPhoneAction = async (action: JarvisAction) => {
    const { type, payload } = action;

    switch (type) {
      case 'open_app': {
        setActiveApp(payload.appId);
        setControlCenterOpen(false);
        setNotificationShadeOpen(false);
        break;
      }

      case 'go_home': {
        setActiveApp(null);
        setControlCenterOpen(false);
        setNotificationShadeOpen(false);
        break;
      }

      case 'make_call': {
        setActiveApp('phone');
        setActiveCall({
          contactName: payload.contactName || 'Contact',
          phoneNumber: payload.phoneNumber || '+1 (555) 019-2831',
          status: 'connected',
          duration: 0,
          isMuted: false,
          isSpeaker: true,
        });
        break;
      }

      case 'end_call': {
        setActiveCall(null);
        break;
      }

      case 'draft_message': {
        setActiveApp('messages');
        setDraftMessage({
          recipient: payload.recipient || 'Alex',
          text: payload.text || 'Hey, checking in!',
          autoSend: payload.autoSend || false,
        });
        break;
      }

      case 'send_message': {
        const found = messages.find(m => m.contactName.toLowerCase().includes(payload.recipient?.toLowerCase() || ''));
        if (found) {
          handleSendMessage(found.id, payload.text);
        } else {
          handleSendMessage(messages[0].id, payload.text);
        }
        break;
      }

      case 'create_calendar_event': {
        const newEvt: CalendarEvent = {
          id: `e-${Date.now()}`,
          title: payload.title || 'Team Sync',
          date: payload.date === 'today' ? 'Today' : 'Tomorrow',
          time: payload.time || '14:00',
          duration: payload.duration || 45,
          location: 'Virtual Conference',
          category: 'work',
        };
        setEvents(prev => [newEvt, ...prev]);
        break;
      }

      case 'toggle_setting': {
        setSettings(prev => ({
          ...prev,
          [payload.setting]: payload.value !== undefined ? payload.value : !(prev as any)[payload.setting],
        }));
        break;
      }

      case 'set_brightness': {
        setSettings(prev => ({ ...prev, brightness: payload.level }));
        break;
      }

      case 'set_volume': {
        setSettings(prev => ({ ...prev, volume: payload.level }));
        break;
      }

      case 'play_music': {
        setIsPlayingMusic(true);
        break;
      }

      case 'pause_music': {
        setIsPlayingMusic(false);
        break;
      }

      case 'next_track': {
        setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
        setIsPlayingMusic(true);
        break;
      }

      case 'create_note': {
        const newNote: Note = {
          id: `note-${Date.now()}`,
          title: payload.title || 'Quick Voice Note',
          content: payload.content || '',
          updatedAt: 'Just now',
        };
        setNotes(prev => [newNote, ...prev]);
        break;
      }

      case 'create_reminder': {
        const newRem: Reminder = {
          id: `rem-${Date.now()}`,
          title: payload.title || 'Task',
          completed: false,
          priority: payload.priority || 'medium',
          due: payload.due || 'Today',
        };
        setReminders(prev => [newRem, ...prev]);
        break;
      }

      case 'open_camera': {
        setActiveApp('camera');
        break;
      }

      case 'read_notifications': {
        setNotificationShadeOpen(true);
        break;
      }

      case 'clear_notifications': {
        setNotifications([]);
        break;
      }

      case 'navigate_to': {
        setActiveDestination(payload.destination || 'Stark Tower');
        setActiveApp('maps');
        break;
      }

      default:
        break;
    }
  };

  // Send message in Messages app
  const handleSendMessage = (threadId: string, text: string) => {
    setMessages(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          lastMessage: text,
          lastTimestamp: 'Just now',
          messages: [
            ...t.messages,
            {
              id: Math.random().toString(),
              sender: 'me',
              text,
              timestamp: 'Just now',
              status: 'delivered',
            },
          ],
        };
      }
      return t;
    }));
    addLog(`Message sent to ${threadId}: "${text}"`, 'action');
  };

  // Read notifications aloud
  const handleReadNotificationsAloud = () => {
    if (notifications.length === 0) {
      speechEngineRef.current?.speak("You have no pending notifications, sir.");
      return;
    }
    const summary = `You have ${notifications.length} notification${notifications.length === 1 ? '' : 's'}. First, from ${notifications[0].title}: ${notifications[0].message}.`;
    speechEngineRef.current?.speak(summary);
    addLog('Jarvis reading notifications aloud', 'jarvis');
  };

  // Active track
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-3 lg:p-6 font-sans antialiased overflow-x-hidden">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Main Responsive Layout: Side-by-Side on Desktop/Tablet, Centered on Mobile */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10 py-4">
        {/* Left Side: Simulated High-End Smartphone running Jarvis OS */}
        <div className="flex-shrink-0">
          <PhoneFrame
            settings={settings}
            activeCall={activeCall}
            musicPlaying={isPlayingMusic}
            currentTrack={currentTrack}
            jarvisActive={jarvisOverlayOpen || jarvisStatus !== 'idle'}
            jarvisStatus={jarvisStatus}
            jarvisTaskTitle={taskTitle}
            activeSteps={executionSteps}
            onOpenApp={(appId) => setActiveApp(appId)}
            onEndCall={() => setActiveCall(null)}
            onHomeClick={() => {
              setActiveApp(null);
              setControlCenterOpen(false);
              setNotificationShadeOpen(false);
            }}
            onPowerButtonClick={invokeJarvis}
            onOpenControlCenter={() => setControlCenterOpen(true)}
            onOpenNotifications={() => setNotificationShadeOpen(true)}
            onJarvisClick={invokeJarvis}
          >
            {/* Screen Content: App or Home Screen */}
            {activeApp === null && (
              <HomeScreen
                onOpenApp={(appId) => setActiveApp(appId)}
                unreadMessagesCount={messages.reduce((acc, m) => acc + m.unreadCount, 0)}
                upcomingEvent={events[0] || null}
                settings={settings}
                onInvokeJarvis={invokeJarvis}
              />
            )}

            {activeApp === 'phone' && (
              <PhoneApp
                contacts={contacts}
                activeCall={activeCall}
                onStartCall={(contactName, phoneNumber) => {
                  setActiveCall({
                    contactName,
                    phoneNumber,
                    status: 'connected',
                    duration: 0,
                    isMuted: false,
                    isSpeaker: false,
                  });
                  addLog(`Outgoing cellular call to ${contactName}`, 'action');
                }}
                onEndCall={() => setActiveCall(null)}
                onToggleMute={() => setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null)}
                onToggleSpeaker={() => setActiveCall(prev => prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null)}
              />
            )}

            {activeApp === 'messages' && (
              <MessagesApp
                threads={messages}
                draftMessage={draftMessage}
                onSendMessage={handleSendMessage}
                onClearDraft={() => setDraftMessage(null)}
              />
            )}

            {activeApp === 'calendar' && (
              <CalendarApp
                events={events}
                onAddEvent={(newEvt) => {
                  setEvents(prev => [{ ...newEvt, id: `e-${Date.now()}` }, ...prev]);
                  addLog(`Scheduled new calendar event: ${newEvt.title}`, 'action');
                }}
              />
            )}

            {activeApp === 'settings' && (
              <SettingsApp
                settings={settings}
                onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
              />
            )}

            {activeApp === 'music' && (
              <MusicApp
                tracks={tracks}
                currentTrackIndex={currentTrackIndex}
                isPlaying={isPlayingMusic}
                progress={musicProgress}
                volume={settings.volume}
                onTogglePlay={() => setIsPlayingMusic(!isPlayingMusic)}
                onNextTrack={() => setCurrentTrackIndex(prev => (prev + 1) % tracks.length)}
                onPrevTrack={() => setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length)}
                onSelectTrack={(idx) => {
                  setCurrentTrackIndex(idx);
                  setIsPlayingMusic(true);
                }}
                onVolumeChange={(vol) => setSettings(prev => ({ ...prev, volume: vol }))}
              />
            )}

            {activeApp === 'camera' && (
              <CameraApp onTakePhoto={() => addLog('Captured photo snapshot with Jarvis Vision', 'action')} />
            )}

            {activeApp === 'notes' && (
              <NotesApp
                notes={notes}
                onAddNote={(title, content) => {
                  setNotes(prev => [{ id: `note-${Date.now()}`, title, content, updatedAt: 'Just now' }, ...prev]);
                  addLog(`Note saved: "${title}"`, 'action');
                }}
                onDeleteNote={(id) => setNotes(prev => prev.filter(n => n.id !== id))}
              />
            )}

            {activeApp === 'reminders' && (
              <RemindersApp
                reminders={reminders}
                onToggleReminder={(id) => setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r))}
                onAddReminder={(title, priority) => {
                  setReminders(prev => [{ id: `rem-${Date.now()}`, title, completed: false, priority, due: 'Today' }, ...prev]);
                  addLog(`Added reminder: "${title}"`, 'action');
                }}
              />
            )}

            {activeApp === 'maps' && (
              <MapsApp destination={activeDestination} />
            )}

            {activeApp === 'clock' && (
              <ClockApp />
            )}

            {/* Overlays inside the phone screen */}
            <ControlCenter
              isOpen={controlCenterOpen}
              onClose={() => setControlCenterOpen(false)}
              settings={settings}
              onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
              currentTrack={currentTrack}
              isPlayingMusic={isPlayingMusic}
              onTogglePlayMusic={() => setIsPlayingMusic(!isPlayingMusic)}
            />

            <NotificationShade
              isOpen={notificationShadeOpen}
              onClose={() => setNotificationShadeOpen(false)}
              notifications={notifications}
              onClearAll={() => setNotifications([])}
              onReadAloud={handleReadNotificationsAloud}
              onOpenApp={(appId) => setActiveApp(appId)}
            />

            <JarvisOverlay
              isOpen={jarvisOverlayOpen}
              onClose={() => setJarvisOverlayOpen(false)}
              status={jarvisStatus}
              transcript={transcript}
              response={jarvisResponse}
              taskTitle={taskTitle}
              steps={executionSteps}
              nluResult={lastNluResult}
              onTriggerExample={handleProcessCommand}
              onToggleMic={toggleListening}
              isMicActive={isContinuousListening}
            />
          </PhoneFrame>
        </div>

        {/* Right Side: Companion Command & Telemetry Deck */}
        <CompanionDashboard
          jarvisStatus={jarvisStatus}
          isListening={isContinuousListening}
          onToggleListening={toggleListening}
          onSendCommand={handleProcessCommand}
          logs={logs}
          settings={settings}
          onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
          onClearLogs={() => setLogs([])}
          contextState={contextState}
          lastNluResult={lastNluResult}
        />
      </div>
    </div>
  );
}
