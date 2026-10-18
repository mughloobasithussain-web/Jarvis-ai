export type AppId =
  | 'phone'
  | 'messages'
  | 'calendar'
  | 'settings'
  | 'music'
  | 'camera'
  | 'notes'
  | 'reminders'
  | 'maps'
  | 'weather'
  | 'clock';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarColor: string;
  avatarInitials: string;
  role?: string;
  favorite?: boolean;
}

export interface MessageItem {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface MessageThread {
  id: string;
  contactName: string;
  contactPhone: string;
  avatarColor: string;
  avatarInitials: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  messages: MessageItem[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD or 'Today' or 'Tomorrow'
  time: string; // HH:mm
  duration: number; // minutes
  location?: string;
  category: 'work' | 'personal' | 'health' | 'urgent';
}

export interface PhoneNotification {
  id: string;
  appId: AppId | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: 'normal' | 'high';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  coverGradient: string;
}

export interface PhoneSettings {
  wifi: boolean;
  wifiSsid: string;
  bluetooth: boolean;
  bluetoothDevice: string;
  flashlight: boolean;
  dnd: boolean;
  cellular: boolean;
  airplaneMode: boolean;
  lowPowerMode: boolean;
  brightness: number; // 0 - 100
  volume: number; // 0 - 100
  wallpaper: 'cyber' | 'deep-space' | 'obsidian' | 'aurora' | 'sunset';
  wakeWordEnabled: boolean;
  voiceStyle: 'jarvis-british' | 'siri-modern' | 'cyber-core';
}

export interface ActiveCall {
  contactName: string;
  phoneNumber: string;
  status: 'calling' | 'connected' | 'ended';
  duration: number; // seconds
  isMuted: boolean;
  isSpeaker: boolean;
}

export interface JarvisAction {
  id?: string;
  type:
    | 'open_app'
    | 'go_home'
    | 'make_call'
    | 'end_call'
    | 'draft_message'
    | 'send_message'
    | 'create_calendar_event'
    | 'delete_calendar_event'
    | 'read_notifications'
    | 'clear_notifications'
    | 'toggle_setting'
    | 'set_brightness'
    | 'set_volume'
    | 'play_music'
    | 'pause_music'
    | 'next_track'
    | 'create_note'
    | 'create_reminder'
    | 'open_camera'
    | 'take_photo'
    | 'navigate_to';
  payload: Record<string, any>;
  description: string;
  status?: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface JarvisExecutionStep {
  id: string;
  description: string;
  action: JarvisAction;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'voice' | 'jarvis' | 'system' | 'action';
}

export interface NLUEntities {
  contact?: string;
  recipient?: string;
  targetApp?: AppId;
  date?: string;
  time?: string;
  duration?: number;
  messageBody?: string;
  hardwareSetting?: string;
  settingValue?: any;
  resolvedPronouns?: Record<string, string>;
  [key: string]: any;
}

export interface NLUResult {
  intent: 
    | 'CALL'
    | 'MESSAGE'
    | 'SCHEDULE'
    | 'APP_CONTROL'
    | 'DEVICE_SETTING'
    | 'MEDIA_CONTROL'
    | 'QUERY_NOTIFICATIONS'
    | 'TAKE_NOTE'
    | 'REMINDER'
    | 'CAMERA_CONTROL'
    | 'NAVIGATION'
    | 'MULTI_STEP_ROUTINE'
    | 'SYSTEM_CONTROL'
    | 'GENERAL_QUERY';
  confidence: number;
  entities: NLUEntities;
  contextUsed?: boolean;
  anaphoraResolution?: string;
}

export interface InteractionMemory {
  id: string;
  timestamp: string;
  userCommand: string;
  intent: string;
  entities: NLUEntities;
  assistantResponse: string;
  referencedContact?: string;
  referencedApp?: AppId;
}

export interface JarvisContextState {
  lastReferencedContact?: {
    name: string;
    phone?: string;
    email?: string;
  };
  lastReferencedApp?: AppId;
  lastReferencedEvent?: {
    title: string;
    date?: string;
    time?: string;
  };
  lastReferencedSetting?: string;
  lastReferencedTrack?: string;
  recentInteractions: InteractionMemory[];
}

