import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Plus, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { MessageThread, MessageItem } from '../../types/phone';

interface MessagesAppProps {
  threads: MessageThread[];
  draftMessage: { recipient: string; text: string; autoSend?: boolean } | null;
  onSendMessage: (threadId: string, text: string) => void;
  onClearDraft: () => void;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({
  threads,
  draftMessage,
  onSendMessage,
  onClearDraft,
}) => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  // Handle draft message triggered by Jarvis
  useEffect(() => {
    if (draftMessage) {
      // Find matching thread or select first
      const found = threads.find(t => 
        t.contactName.toLowerCase().includes(draftMessage.recipient.toLowerCase())
      );
      if (found) {
        setActiveThreadId(found.id);
      } else if (threads.length > 0) {
        setActiveThreadId(threads[0].id);
      }
      setInputText(draftMessage.text);

      if (draftMessage.autoSend) {
        const targetId = found ? found.id : threads[0]?.id;
        if (targetId) {
          setTimeout(() => {
            onSendMessage(targetId, draftMessage.text);
            setInputText('');
            onClearDraft();
          }, 800);
        }
      }
    }
  }, [draftMessage]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSend = () => {
    if (!inputText.trim() || !activeThreadId) return;
    onSendMessage(activeThreadId, inputText.trim());
    setInputText('');
    onClearDraft();
  };

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-neutral-800/80 flex items-center justify-between">
        {activeThread ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveThreadId(null)}
              className="p-1 hover:bg-neutral-800 rounded-lg text-cyan-400"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${activeThread.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
              {activeThread.avatarInitials}
            </div>
            <div>
              <div className="text-xs font-semibold">{activeThread.contactName}</div>
              <div className="text-[10px] text-cyan-400 font-mono">iMessage • Encrypted</div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-lg font-bold tracking-tight">Messages</h1>
            <p className="text-[11px] text-neutral-400">Jarvis Voice Dictation Active</p>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/50 text-cyan-300 text-[10px] font-mono flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>AI Draft</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeThread ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Messages Bubble List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            <div className="text-center text-[10px] text-neutral-500 font-mono my-2">
              Today • End-to-End Encrypted via Jarvis Link
            </div>

            {activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs ${
                    msg.sender === 'me'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-neutral-500 mt-0.5 px-1 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'me' && (
                    <CheckCheck className="w-2.5 h-2.5 text-cyan-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Jarvis Draft Indicator */}
          {draftMessage && (
            <div className="mx-3 mb-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-[11px] text-cyan-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                <span>Jarvis drafted from voice command</span>
              </span>
              <button
                onClick={handleSend}
                className="px-2 py-0.5 rounded bg-cyan-500 text-neutral-950 font-bold hover:bg-cyan-400 text-[10px]"
              >
                Approve & Send
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-2 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${activeThread.contactName}...`}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-full bg-cyan-500 disabled:opacity-40 hover:bg-cyan-400 text-neutral-950 flex items-center justify-center transition-all disabled:pointer-events-none"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Conversation Threads List */
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`relative w-10 h-10 rounded-full bg-gradient-to-tr ${thread.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-md`}>
                  {thread.avatarInitials}
                  {thread.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-500 text-black rounded-full text-[9px] font-bold flex items-center justify-center">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-100 flex items-center gap-2">
                    <span>{thread.contactName}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">{thread.lastTimestamp}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate max-w-[190px]">
                    {thread.lastMessage}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
