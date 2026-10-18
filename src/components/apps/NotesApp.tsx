import React, { useState } from 'react';
import { Plus, Search, FileText, Sparkles, Trash2 } from 'lucide-react';
import { Note } from '../../types/phone';

interface NotesAppProps {
  notes: Note[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSave = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    onAddNote(newTitle.trim() || 'Untitled Note', newContent.trim());
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Notes & Memos</h1>
          <p className="text-xs text-neutral-400 font-mono">Synced with Jarvis Voice</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedNote(null);
          }}
          className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {isCreating ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note Title..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Start typing or tell Jarvis 'Take a note'..."
              rows={5}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
              >
                Save Note
              </button>
            </div>
          </div>
        ) : selectedNote ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-bold text-white">{selectedNote.title}</h2>
              <button
                onClick={() => {
                  onDeleteNote(selectedNote.id);
                  setSelectedNote(null);
                }}
                className="text-neutral-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono">{selectedNote.updatedAt}</p>
            <div className="pt-2 text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">
              {selectedNote.content}
            </div>
            <button
              onClick={() => setSelectedNote(null)}
              className="mt-3 text-xs text-cyan-400 underline block"
            >
              Back to all notes
            </button>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white truncate max-w-[200px]">{note.title}</h3>
                <span className="text-[9px] text-neutral-500 font-mono">{note.updatedAt}</span>
              </div>
              <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-normal">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
