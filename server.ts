import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Jarvis System Instruction for Phone OS control, NLU Entity Extraction & Contextual Awareness
const JARVIS_SYSTEM_PROMPT = `You are "Jarvis", an elite AI personal assistant and Natural Language Understanding (NLU) engine built directly into the user's smartphone, operating like Siri/Jarvis.
You possess state-of-the-art NLU intent classification, entity extraction, and Contextual Awareness with Coreference / Anaphora Resolution.

Key Capabilities:
1. Identify User Intent:
   - "CALL" (dialing or making phone calls)
   - "MESSAGE" (drafting, composing, or sending SMS/chat)
   - "SCHEDULE" (booking, scheduling, modifying meetings or calendar events)
   - "APP_CONTROL" (opening apps, navigating to home screen)
   - "DEVICE_SETTING" (adjusting Wi-Fi, Bluetooth, Torch/Flashlight, DND, volume, brightness)
   - "MEDIA_CONTROL" (playing, pausing, skipping music)
   - "QUERY_NOTIFICATIONS" (reading, inspecting, or clearing notifications)
   - "TAKE_NOTE" (recording notes and voice memos)
   - "REMINDER" (creating to-do tasks and reminders)
   - "CAMERA_CONTROL" (opening camera, taking snapshots)
   - "NAVIGATION" (directions, GPS mapping)
   - "MULTI_STEP_ROUTINE" (compound multi-action routines like morning or sleep routines)
   - "SYSTEM_CONTROL" (locking, battery, hardware status)
   - "GENERAL_QUERY" (brief assistance or questions)

2. Extract Entities:
   - contact: string (e.g., "John", "Sarah Connor", "Mom", "Alex Tech")
   - recipient: string (for messages)
   - targetApp: string (e.g., "phone", "messages", "calendar", "settings", "music", "camera", "notes", "reminders", "maps", "clock")
   - date: string (e.g., "today", "tomorrow", "Friday", "2026-10-19")
   - time: string (e.g., "14:00", "09:30", "3:00 PM")
   - duration: number (in minutes)
   - messageBody: string (the actual message text)
   - hardwareSetting: string (e.g., "wifi", "bluetooth", "flashlight", "dnd", "volume", "brightness")
   - settingValue: any (e.g., true, false, 85)
   - resolvedPronouns: Record<string, string> (e.g., {"him": "John"}, {"her": "Sarah Connor"}, {"it": "Flashlight"})

3. Contextual Awareness & Follow-up Anaphora Resolution (CRITICAL):
   You will receive:
   - "Context Memory": { "lastReferencedContact", "lastReferencedApp", "lastReferencedEvent", "lastReferencedSetting" }
   - "Recent Conversation History": previous user orders and assistant replies.
   
   CRITICAL PRONOUN & REFERENT RULES:
   - If the user uses pronouns such as "him", "he", "her", "she", "them", "that person", "this contact":
     Inspect the Context Memory and Conversation History to identify who was referenced previously.
     EXAMPLE: If the user previously asked to "call John", and the current order is "message him to say I'm running late":
     You MUST resolve "him" to "John".
     Set:
     - nlu.intent = "MESSAGE"
     - nlu.entities.recipient = "John"
     - nlu.entities.messageBody = "I'm running late"
     - nlu.entities.resolvedPronouns = { "him": "John" }
     - nlu.contextUsed = true
     - nlu.anaphoraResolution = "Resolved 'him' to John from previous call interaction."
     - actions: [ { "type": "open_app", "payload": { "appId": "messages" } }, { "type": "draft_message", "payload": { "recipient": "John", "text": "I'm running late", "autoSend": false } } ]
     - spokenResponse: "I have drafted a message to John: 'I'm running late'."
   - If the user says "call him back" or "call her", resolve to the last referenced contact.
   - If the user says "turn it off" or "turn it on", resolve "it" to the last referenced device setting (e.g. flashlight, wifi, dnd).
   - If the user says "take a picture" or "snap a photo" after camera was opened, trigger "take_photo".
   - If the user says "change the time to 4 PM", update the last scheduled event.

You MUST return a JSON response matching this schema:
{
  "nlu": {
    "intent": string,
    "confidence": number,
    "entities": object,
    "contextUsed": boolean,
    "anaphoraResolution": string
  },
  "spokenResponse": string,
  "taskTitle": string,
  "actions": [
    {
      "type": "open_app" | "go_home" | "make_call" | "end_call" | "draft_message" | "send_message" | "create_calendar_event" | "delete_calendar_event" | "read_notifications" | "clear_notifications" | "toggle_setting" | "set_brightness" | "set_volume" | "play_music" | "pause_music" | "next_track" | "create_note" | "create_reminder" | "open_camera" | "take_photo" | "navigate_to",
      "payload": object,
      "description": string
    }
  ],
  "contextUpdates": {
    "lastReferencedContact": { "name": string, "phone"?: string },
    "lastReferencedApp": string,
    "lastReferencedEvent"?: { "title": string, "time"?: string, "date"?: string },
    "lastReferencedSetting"?: string
  },
  "requiresConfirmation": false
}

Always respond strictly in valid JSON without markdown fences.`;

// POST /api/jarvis/process
app.post('/api/jarvis/process', async (req, res) => {
  try {
    const { command, phoneState, contextMemory, conversationHistory } = req.body;

    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Command text is required.' });
    }

    // Clean up wake word prefixes if present
    const cleanedCommand = command
      .replace(/^(hey|ok|hi|hello)?\s*jarvis[,.]?\s*/i, '')
      .trim();

    const promptContext = `Current Phone State:
- Active Screen / App: ${phoneState?.activeApp || 'Home Screen'}
- Device Settings: Wi-Fi: ${phoneState?.settings?.wifi ? 'ON' : 'OFF'}, Bluetooth: ${phoneState?.settings?.bluetooth ? 'ON' : 'OFF'}, Flashlight: ${phoneState?.settings?.flashlight ? 'ON' : 'OFF'}, DND: ${phoneState?.settings?.dnd ? 'ON' : 'OFF'}, Low Power: ${phoneState?.settings?.lowPowerMode ? 'ON' : 'OFF'}, Brightness: ${phoneState?.settings?.brightness ?? 80}%, Volume: ${phoneState?.settings?.volume ?? 75}%
- Active Call: ${phoneState?.activeCall ? `In call with ${phoneState.activeCall.contactName}` : 'None'}
- Music Playing: ${phoneState?.musicPlayer?.isPlaying ? `Playing '${phoneState.musicPlayer.tracks?.[phoneState.musicPlayer.currentTrackIndex]?.title || 'Track'}'` : 'Paused'}
- Pending Notifications Count: ${phoneState?.notifications?.length ?? 0}
- Current Date/Time: ${new Date().toISOString()}

Contextual Memory & Recent State:
- Last Referenced Contact: ${contextMemory?.lastReferencedContact?.name ? JSON.stringify(contextMemory.lastReferencedContact) : 'None'}
- Last Referenced App: ${contextMemory?.lastReferencedApp || 'None'}
- Last Referenced Setting: ${contextMemory?.lastReferencedSetting || 'None'}
- Last Referenced Event: ${contextMemory?.lastReferencedEvent ? JSON.stringify(contextMemory.lastReferencedEvent) : 'None'}
- Recent Conversation History:
${(conversationHistory || contextMemory?.recentInteractions || []).slice(-4).map((h: any, idx: number) => `  ${idx + 1}. User: "${h.userCommand || h.command}" -> Jarvis: "${h.assistantResponse || h.response}" (Intent: ${h.intent || 'N/A'}, Entities: ${JSON.stringify(h.entities || {})})`).join('\n') || '  (No previous interactions in this session)'}

Available Contacts Directory:
${(phoneState?.contacts || []).map((c: any) => `  - ${c.name} (${c.phone}, ${c.role || 'Contact'})`).join('\n')}

User's spoken command: "${cleanedCommand || command}"`;

    if (ai) {
      try {
        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: promptContext }],
            },
          ],
          config: {
            systemInstruction: JARVIS_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out')), 5000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const rawText = response.text?.trim() || '{}';
        const parsed = JSON.parse(rawText);
        return res.json(parsed);
      } catch (geminiError) {
        console.warn('Gemini API call bypassed or timed out, using deterministic NLU parser:', geminiError);
        // Fallback to local NLU parser below
      }
    }

    // Fallback deterministic NLU engine with Contextual Coreference & Entity resolution
    const fallbackResult = parseLocally(cleanedCommand || command, phoneState, contextMemory);
    return res.json(fallbackResult);
  } catch (error) {
    console.error('Error processing Jarvis command:', error);
    res.status(500).json({
      spokenResponse: "I encountered an issue processing that order, sir. Please try again.",
      taskTitle: "Error",
      nlu: { intent: "SYSTEM_CONTROL", confidence: 0.5, entities: {}, contextUsed: false },
      actions: [],
    });
  }
});

// Deterministic heuristic NLU engine for instant zero-latency responses & offline fallback
function parseLocally(cmd: string, phoneState: any, contextMemory: any) {
  const lower = cmd.toLowerCase().trim();
  const actions: any[] = [];
  let spokenResponse = "Command executed, sir.";
  let taskTitle = "Jarvis Execution";

  // Contextual referent lookup
  const lastContactName = contextMemory?.lastReferencedContact?.name || 
    contextMemory?.recentInteractions?.find((i: any) => i.entities?.contact || i.entities?.recipient)?.entities?.contact ||
    contextMemory?.recentInteractions?.find((i: any) => i.entities?.recipient)?.entities?.recipient;
  
  const lastSetting = contextMemory?.lastReferencedSetting;
  const lastApp = contextMemory?.lastReferencedApp || phoneState?.activeApp;

  // Initialize NLU metadata
  interface LocalNLU {
    intent: string;
    confidence: number;
    entities: Record<string, any>;
    contextUsed: boolean;
    anaphoraResolution?: string;
  }

  let nluResult: LocalNLU = {
    intent: 'GENERAL_QUERY',
    confidence: 0.95,
    entities: {},
    contextUsed: false,
    anaphoraResolution: '',
  };

  let contextUpdates: Record<string, any> = {};

  // 1. Follow-up Anaphora / Pronoun resolution for Messaging:
  // e.g., "message him to say I'm running late", "text him saying...", "message her that..."
  const pronounMessageMatch = lower.match(/(?:message|text|send (?:a )?message to|draft (?:a )?message to)\s+(him|her|them|that person|that contact)\s+(?:to say|that|saying|:)?\s*(.*)/i);
  if (pronounMessageMatch) {
    const pronoun = pronounMessageMatch[1].toLowerCase();
    const messageText = pronounMessageMatch[2]?.trim() || "I am running a bit late.";
    const resolvedContact = lastContactName || "John";

    nluResult = {
      intent: 'MESSAGE',
      confidence: 0.99,
      entities: {
        recipient: resolvedContact,
        messageBody: messageText,
        resolvedPronouns: { [pronoun]: resolvedContact },
      },
      contextUsed: true,
      anaphoraResolution: `Resolved pronoun '${pronoun}' to ${resolvedContact} from previous interaction.`,
    };

    actions.push(
      { type: 'open_app', payload: { appId: 'messages' }, description: 'Open Messages' },
      { type: 'draft_message', payload: { recipient: resolvedContact, text: messageText, autoSend: false }, description: `Draft message to ${resolvedContact}` }
    );

    spokenResponse = `I have drafted a message to ${resolvedContact}: "${messageText}".`;
    taskTitle = `Draft SMS to ${resolvedContact}`;
    contextUpdates = {
      lastReferencedContact: { name: resolvedContact },
      lastReferencedApp: 'messages',
    };

    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 2. Follow-up Calling by Pronoun:
  // e.g., "call him", "call her", "call them back"
  const pronounCallMatch = lower.match(/^(?:call|dial|phone)\s+(him|her|them|that contact|that person)(?:\s+back)?/i);
  if (pronounCallMatch) {
    const pronoun = pronounCallMatch[1].toLowerCase();
    const resolvedContact = lastContactName || "John";
    const foundContact = (phoneState?.contacts || []).find((c: any) => c.name.toLowerCase() === resolvedContact.toLowerCase()) || { name: resolvedContact, phone: '+1 (415) 555-0144' };

    nluResult = {
      intent: 'CALL',
      confidence: 0.98,
      entities: {
        contact: resolvedContact,
        phoneNumber: foundContact.phone,
        resolvedPronouns: { [pronoun]: resolvedContact },
      },
      contextUsed: true,
      anaphoraResolution: `Resolved pronoun '${pronoun}' to ${resolvedContact} from context memory.`,
    };

    actions.push({ type: 'make_call', payload: { contactName: foundContact.name, phoneNumber: foundContact.phone }, description: `Call ${foundContact.name}` });
    spokenResponse = `Calling ${foundContact.name} now, sir.`;
    taskTitle = `Call ${foundContact.name}`;
    contextUpdates = {
      lastReferencedContact: { name: foundContact.name, phone: foundContact.phone },
      lastReferencedApp: 'phone',
    };

    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 3. Follow-up "Turn it off / Turn it on":
  if (lower === 'turn it off' || lower === 'turn it on' || lower === 'switch it off' || lower === 'switch it on' || lower === 'disable it' || lower === 'enable it') {
    const turnOn = lower.includes('on') || lower.includes('enable');
    const targetSetting = lastSetting || (phoneState?.settings?.flashlight ? 'flashlight' : 'wifi');

    nluResult = {
      intent: 'DEVICE_SETTING',
      confidence: 0.96,
      entities: {
        hardwareSetting: targetSetting,
        settingValue: turnOn,
        resolvedPronouns: { 'it': targetSetting },
      },
      contextUsed: true,
      anaphoraResolution: `Resolved pronoun 'it' to '${targetSetting}' from previous hardware context.`,
    };

    actions.push({ type: 'toggle_setting', payload: { setting: targetSetting, value: turnOn }, description: `${turnOn ? 'Enable' : 'Disable'} ${targetSetting}` });
    spokenResponse = `${targetSetting.charAt(0).toUpperCase() + targetSetting.slice(1)} turned ${turnOn ? 'on' : 'off'}.`;
    taskTitle = `Toggle ${targetSetting}`;
    contextUpdates = { lastReferencedSetting: targetSetting };

    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 4. Calling explicitly named contact:
  if (lower.startsWith('call ') || lower.includes('dial ') || lower.includes('make a call to')) {
    const rawName = lower.replace(/^(call|dial|make a call to)\s+/i, '').replace(/on (phone|speaker)/i, '').trim();
    const contact = (phoneState?.contacts || []).find((c: any) => c.name.toLowerCase().includes(rawName)) || { name: rawName.charAt(0).toUpperCase() + rawName.slice(1) || 'Contact', phone: '+1 (555) 019-2831' };

    nluResult = {
      intent: 'CALL',
      confidence: 0.98,
      entities: {
        contact: contact.name,
        phoneNumber: contact.phone,
      },
      contextUsed: false,
    };

    actions.push({ type: 'make_call', payload: { contactName: contact.name, phoneNumber: contact.phone }, description: `Call ${contact.name}` });
    spokenResponse = `Calling ${contact.name} now, sir.`;
    taskTitle = `Call ${contact.name}`;
    contextUpdates = {
      lastReferencedContact: { name: contact.name, phone: contact.phone },
      lastReferencedApp: 'phone',
    };

    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 5. Explicit Messaging:
  if (lower.includes('text ') || lower.includes('message ') || lower.includes('draft ')) {
    const match = lower.match(/(?:text|message|draft (?:a )?message to)\s+([a-zA-Z\s]+?)(?:\s+(?:that|saying|to say|and say|:)\s+(.*)|$)/i);
    const recipientRaw = match && match[1] ? match[1].trim() : "Alex";
    const contact = (phoneState?.contacts || []).find((c: any) => c.name.toLowerCase().includes(recipientRaw.toLowerCase()));
    const recipient = contact ? contact.name : (recipientRaw.charAt(0).toUpperCase() + recipientRaw.slice(1));
    const text = match && match[2] ? match[2].trim() : "Hey, checking in!";

    nluResult = {
      intent: 'MESSAGE',
      confidence: 0.97,
      entities: {
        recipient,
        messageBody: text,
      },
      contextUsed: false,
    };

    actions.push(
      { type: 'open_app', payload: { appId: 'messages' }, description: 'Open Messages' },
      { type: 'draft_message', payload: { recipient, text, autoSend: false }, description: `Draft message to ${recipient}` }
    );
    spokenResponse = `I have drafted a message to ${recipient}: "${text}". Ready to send.`;
    taskTitle = `Draft SMS to ${recipient}`;
    contextUpdates = {
      lastReferencedContact: { name: recipient },
      lastReferencedApp: 'messages',
    };

    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 6. Scheduling / Calendar:
  if (lower.includes('schedule') || lower.includes('meeting') || lower.includes('calendar') || lower.includes('appointment')) {
    const titleMatch = lower.match(/(?:schedule|book|create)(?:\s+a)?\s+(?:meeting|appointment|call)?\s*(?:with|for|called)?\s*([a-zA-Z\s0-9]+?)(?:\s+(?:at|for|tomorrow|today|on)|$)/i);
    const title = titleMatch && titleMatch[1] ? titleMatch[1].trim() : "Project Review";
    const date = lower.includes('today') ? 'Today' : 'Tomorrow';
    const timeMatch = lower.match(/(?:at|for)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    const time = timeMatch ? timeMatch[1].toUpperCase() : '14:00';

    nluResult = {
      intent: 'SCHEDULE',
      confidence: 0.96,
      entities: {
        title,
        date,
        time,
        duration: 45,
      },
      contextUsed: false,
    };

    actions.push(
      { type: 'open_app', payload: { appId: 'calendar' }, description: 'Open Calendar' },
      { type: 'create_calendar_event', payload: { title: title.charAt(0).toUpperCase() + title.slice(1), date, time, duration: 45 }, description: `Schedule "${title}"` }
    );
    spokenResponse = `Scheduled "${title}" on your calendar for ${date} at ${time}.`;
    taskTitle = "Schedule Calendar Event";
    contextUpdates = {
      lastReferencedEvent: { title, date, time },
      lastReferencedApp: 'calendar',
    };

    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 7. Morning Routine Multi-Step
  if (lower.includes('morning routine') || (lower.includes('good morning') && lower.includes('routine'))) {
    nluResult = {
      intent: 'MULTI_STEP_ROUTINE',
      confidence: 0.99,
      entities: { routineType: 'morning' },
      contextUsed: false,
    };

    taskTitle = "Morning Routine";
    actions.push(
      { type: 'toggle_setting', payload: { setting: 'dnd', value: false }, description: 'Disable Do Not Disturb' },
      { type: 'set_brightness', payload: { level: 85 }, description: 'Set Brightness to 85%' },
      { type: 'play_music', payload: { genre: 'Lo-Fi Focus' }, description: 'Start Morning Playlist' },
      { type: 'open_app', payload: { appId: 'calendar' }, description: 'Open Daily Calendar' }
    );
    spokenResponse = "Good morning! I have disabled Do Not Disturb, set your brightness to 85%, started your morning music, and opened today's calendar.";
    contextUpdates = { lastReferencedApp: 'calendar' };
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 8. Night Routine Multi-Step
  if (lower.includes('night routine') || lower.includes('sleep mode') || lower.includes('going to bed') || lower.includes('good night')) {
    nluResult = {
      intent: 'MULTI_STEP_ROUTINE',
      confidence: 0.99,
      entities: { routineType: 'night' },
      contextUsed: false,
    };

    taskTitle = "Night Sleep Routine";
    actions.push(
      { type: 'toggle_setting', payload: { setting: 'dnd', value: true }, description: 'Enable Do Not Disturb' },
      { type: 'set_brightness', payload: { level: 15 }, description: 'Dim Brightness to 15%' },
      { type: 'pause_music', payload: {}, description: 'Pause Music Playback' },
      { type: 'open_app', payload: { appId: 'clock' }, description: 'Show Morning Alarms' }
    );
    spokenResponse = "Good night, sir. Do Not Disturb is enabled, screen brightness is dimmed, and audio playback has ceased. Sleep well.";
    contextUpdates = { lastReferencedApp: 'clock' };
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 9. Meeting Mode Multi-Step
  if (lower.includes('meeting mode') || lower.includes('going into a meeting') || lower.includes('busy mode')) {
    nluResult = {
      intent: 'MULTI_STEP_ROUTINE',
      confidence: 0.99,
      entities: { routineType: 'meeting' },
      contextUsed: false,
    };

    taskTitle = "Meeting Protocol";
    actions.push(
      { type: 'toggle_setting', payload: { setting: 'dnd', value: true }, description: 'Enable Do Not Disturb' },
      { type: 'set_volume', payload: { level: 0 }, description: 'Mute System Volume' },
      { type: 'go_home', payload: {}, description: 'Return to Home Screen' }
    );
    spokenResponse = "Meeting protocol initiated. Do Not Disturb is on and your phone volume is silenced.";
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 10. Hardware Flashlight
  if (lower.includes('flashlight') || lower.includes('torch')) {
    const turnOn = !lower.includes('turn off') && !lower.includes('disable');
    nluResult = {
      intent: 'DEVICE_SETTING',
      confidence: 0.98,
      entities: { hardwareSetting: 'flashlight', settingValue: turnOn },
      contextUsed: false,
    };

    actions.push({ type: 'toggle_setting', payload: { setting: 'flashlight', value: turnOn }, description: `${turnOn ? 'Turn on' : 'Turn off'} Flashlight` });
    spokenResponse = turnOn ? "Flashlight turned on." : "Flashlight turned off.";
    taskTitle = "Flashlight";
    contextUpdates = { lastReferencedSetting: 'flashlight' };
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 11. Wi-Fi
  if (lower.includes('wifi') || lower.includes('wi-fi')) {
    const turnOn = !lower.includes('turn off') && !lower.includes('disable');
    nluResult = {
      intent: 'DEVICE_SETTING',
      confidence: 0.98,
      entities: { hardwareSetting: 'wifi', settingValue: turnOn },
      contextUsed: false,
    };

    actions.push({ type: 'toggle_setting', payload: { setting: 'wifi', value: turnOn }, description: `${turnOn ? 'Enable' : 'Disable'} Wi-Fi` });
    spokenResponse = turnOn ? "Wi-Fi enabled." : "Wi-Fi disabled.";
    taskTitle = "Wi-Fi";
    contextUpdates = { lastReferencedSetting: 'wifi' };
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 12. Bluetooth
  if (lower.includes('bluetooth')) {
    const turnOn = !lower.includes('turn off') && !lower.includes('disable');
    nluResult = {
      intent: 'DEVICE_SETTING',
      confidence: 0.98,
      entities: { hardwareSetting: 'bluetooth', settingValue: turnOn },
      contextUsed: false,
    };

    actions.push({ type: 'toggle_setting', payload: { setting: 'bluetooth', value: turnOn }, description: `${turnOn ? 'Enable' : 'Disable'} Bluetooth` });
    spokenResponse = turnOn ? "Bluetooth connected." : "Bluetooth disconnected.";
    taskTitle = "Bluetooth";
    contextUpdates = { lastReferencedSetting: 'bluetooth' };
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 13. Camera & Take Photo
  if (lower.includes('take a photo') || lower.includes('snap a picture') || lower.includes('take picture') || lower.includes('capture')) {
    nluResult = {
      intent: 'CAMERA_CONTROL',
      confidence: 0.98,
      entities: { action: 'take_photo' },
      contextUsed: lastApp === 'camera',
    };

    if (lastApp !== 'camera') {
      actions.push({ type: 'open_app', payload: { appId: 'camera' }, description: 'Open Camera' });
    }
    actions.push({ type: 'take_photo', payload: {}, description: 'Capture Photo' });
    spokenResponse = "Photo captured with Jarvis Vision.";
    taskTitle = "Capture Photo";
    contextUpdates = { lastReferencedApp: 'camera' };
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 14. Notifications
  if (lower.includes('notification')) {
    if (lower.includes('clear') || lower.includes('delete') || lower.includes('dismiss')) {
      nluResult = { intent: 'QUERY_NOTIFICATIONS', confidence: 0.98, entities: { action: 'clear' }, contextUsed: false };
      actions.push({ type: 'clear_notifications', payload: {}, description: 'Clear All Notifications' });
      spokenResponse = "All notifications have been cleared.";
      taskTitle = "Clear Notifications";
    } else {
      nluResult = { intent: 'QUERY_NOTIFICATIONS', confidence: 0.98, entities: { action: 'read' }, contextUsed: false };
      actions.push({ type: 'read_notifications', payload: {}, description: 'Read Notifications' });
      const count = phoneState?.notifications?.length ?? 3;
      spokenResponse = `You have ${count} pending notification${count === 1 ? '' : 's'}. Reading the most recent: Sarah sent a message, and you have a calendar reminder.`;
      taskTitle = "Notifications";
    }
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 15. Music
  if (lower.includes('music') || lower.includes('song') || lower.includes('track') || lower.includes('play')) {
    if (lower.includes('pause') || lower.includes('stop')) {
      nluResult = { intent: 'MEDIA_CONTROL', confidence: 0.98, entities: { mediaAction: 'pause' }, contextUsed: false };
      actions.push({ type: 'pause_music', payload: {}, description: 'Pause Music' });
      spokenResponse = "Music playback paused.";
      taskTitle = "Pause Music";
    } else if (lower.includes('next') || lower.includes('skip')) {
      nluResult = { intent: 'MEDIA_CONTROL', confidence: 0.98, entities: { mediaAction: 'skip' }, contextUsed: false };
      actions.push({ type: 'next_track', payload: {}, description: 'Skip Track' });
      spokenResponse = "Skipping to the next track.";
      taskTitle = "Next Track";
    } else {
      nluResult = { intent: 'MEDIA_CONTROL', confidence: 0.98, entities: { mediaAction: 'play' }, contextUsed: false };
      actions.push(
        { type: 'open_app', payload: { appId: 'music' }, description: 'Open Music Player' },
        { type: 'play_music', payload: { trackName: 'Lo-Fi Chill Synth' }, description: 'Play Music' }
      );
      spokenResponse = "Playing your focus playlist on Jarvis Music.";
      taskTitle = "Play Music";
      contextUpdates = { lastReferencedApp: 'music' };
    }
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // 16. Open specific app
  const appMap: Record<string, string> = {
    phone: 'phone',
    dialer: 'phone',
    messages: 'messages',
    message: 'messages',
    sms: 'messages',
    calendar: 'calendar',
    settings: 'settings',
    music: 'music',
    camera: 'camera',
    notes: 'notes',
    reminders: 'reminders',
    maps: 'maps',
    weather: 'weather',
    clock: 'clock',
    alarm: 'clock',
  };

  for (const [key, val] of Object.entries(appMap)) {
    if (lower.includes(`open ${key}`) || lower.includes(`launch ${key}`) || lower === key) {
      nluResult = { intent: 'APP_CONTROL', confidence: 0.98, entities: { targetApp: val }, contextUsed: false };
      actions.push({ type: 'open_app', payload: { appId: val }, description: `Open ${val.charAt(0).toUpperCase() + val.slice(1)}` });
      spokenResponse = `Opening ${val.charAt(0).toUpperCase() + val.slice(1)}.`;
      taskTitle = `Open ${val}`;
      contextUpdates = { lastReferencedApp: val };
      return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
    }
  }

  // Home screen
  if (lower.includes('home screen') || lower.includes('go home') || lower.includes('minimize') || lower === 'home') {
    nluResult = { intent: 'APP_CONTROL', confidence: 0.98, entities: { targetApp: 'home' }, contextUsed: false };
    actions.push({ type: 'go_home', payload: {}, description: 'Return to Home Screen' });
    spokenResponse = "Taking you back to the home screen.";
    taskTitle = "Home Screen";
    contextUpdates = { lastReferencedApp: null };
    return { nlu: nluResult, spokenResponse, taskTitle, actions, contextUpdates };
  }

  // Default fallback
  nluResult = { intent: 'GENERAL_QUERY', confidence: 0.85, entities: { rawCommand: cmd }, contextUsed: false };
  return {
    nlu: nluResult,
    spokenResponse: `Understood, sir. Processing: "${cmd}". You can order me to call contacts, draft messages, toggle settings, or execute routines.`,
    taskTitle: "Voice Command",
    actions: [{ type: 'go_home', payload: {}, description: 'Jarvis Acknowledged' }],
    contextUpdates: {},
  };
}

// In production, serve built files; in development, mount Vite middleware
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Jarvis Phone Assistant server listening on http://0.0.0.0:${port}`);
});
