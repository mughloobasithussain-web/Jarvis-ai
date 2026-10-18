import React, { useState } from 'react';
import { Phone, PhoneCall, PhoneOff, User, Star, Clock, Grid, Search, Mic, MicOff, Volume2, Shield } from 'lucide-react';
import { Contact, ActiveCall } from '../../types/phone';
import { playDialTone } from '../../utils/soundEffects';

interface PhoneAppProps {
  contacts: Contact[];
  activeCall: ActiveCall | null;
  onStartCall: (contactName: string, phoneNumber: string) => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({
  contacts,
  activeCall,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recents' | 'contacts' | 'keypad'>('contacts');
  const [dialNumber, setDialNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Keypad press handler
  const handleKeypadPress = (num: string, freq: number) => {
    playDialTone(freq);
    setDialNumber(prev => (prev.length < 15 ? prev + num : prev));
  };

  // If in an active call
  if (activeCall) {
    const minutes = Math.floor(activeCall.duration / 60);
    const seconds = activeCall.duration % 60;
    const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
      <div className="h-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white flex flex-col justify-between p-6">
        {/* Contact Info Header */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white text-3xl font-bold flex items-center justify-center shadow-xl mb-4 border border-cyan-400/30">
            {activeCall.contactName.slice(0, 2).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{activeCall.contactName}</h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">{activeCall.phoneNumber}</p>
          <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Call Connected • {formattedDuration}</span>
          </div>
          <div className="mt-2 text-[10px] text-cyan-400/80 font-mono flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Jarvis Encrypted Cellular Line</span>
          </div>
        </div>

        {/* In-Call Controls */}
        <div className="w-full max-w-xs mx-auto space-y-6 pb-6">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={onToggleMute}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                activeCall.isMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              {activeCall.isMuted ? <MicOff className="w-6 h-6 mb-1" /> : <Mic className="w-6 h-6 mb-1" />}
              <span className="text-[10px]">{activeCall.isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setActiveTab('keypad')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all"
            >
              <Grid className="w-6 h-6 mb-1" />
              <span className="text-[10px]">Keypad</span>
            </button>

            <button
              onClick={onToggleSpeaker}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                activeCall.isSpeaker
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Volume2 className="w-6 h-6 mb-1" />
              <span className="text-[10px]">{activeCall.isSpeaker ? 'Speaker On' : 'Speaker'}</span>
            </button>
          </div>

          {/* End Call Button */}
          <div className="flex justify-center">
            <button
              onClick={onEndCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/40 transition-transform active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter contacts
  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800/80">
        <h1 className="text-xl font-bold tracking-tight mb-2">Phone</h1>
        {activeTab !== 'keypad' && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts or numbers..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {activeTab === 'contacts' && (
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider py-1">
              All Contacts ({filteredContacts.length})
            </div>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onStartCall(contact.name, contact.phone)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${contact.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-md`}>
                    {contact.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                      <span>{contact.name}</span>
                      {contact.favorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">{contact.phone}</div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartCall(contact.name, contact.phone);
                  }}
                  className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider py-1">
              Speed Dial Favorites
            </div>
            {contacts.filter(c => c.favorite).map((contact) => (
              <div
                key={contact.id}
                onClick={() => onStartCall(contact.name, contact.phone)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${contact.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-md`}>
                    {contact.avatarInitials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{contact.name}</div>
                    <div className="text-[11px] text-cyan-400 font-mono">{contact.role || 'Speed Dial'}</div>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recents' && (
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider py-1">
              Recent Calls
            </div>
            {contacts.slice(0, 4).map((contact, i) => (
              <div
                key={contact.id}
                onClick={() => onStartCall(contact.name, contact.phone)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className={`w-4 h-4 ${i === 1 ? 'text-red-400' : 'text-neutral-400'}`} />
                  <div>
                    <div className={`text-xs font-semibold ${i === 1 ? 'text-red-400' : 'text-white'}`}>
                      {contact.name}
                    </div>
                    <div className="text-[10px] text-neutral-500">{i === 1 ? 'Missed Call' : 'Outgoing Call (4m 12s)'}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  {i === 0 ? '10:45 AM' : i === 1 ? 'Yesterday' : 'Friday'}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'keypad' && (
          <div className="flex flex-col items-center justify-center py-2">
            {/* Number Display */}
            <div className="h-10 flex items-center justify-center text-2xl font-mono tracking-wider font-semibold text-white mb-3">
              {dialNumber || <span className="text-neutral-600">Enter Number</span>}
            </div>

            {/* Dial Keypad Grid */}
            <div className="grid grid-cols-3 gap-3 w-64 max-w-full">
              {[
                { n: '1', sub: '', f: 697 },
                { n: '2', sub: 'ABC', f: 770 },
                { n: '3', sub: 'DEF', f: 852 },
                { n: '4', sub: 'GHI', f: 697 },
                { n: '5', sub: 'JKL', f: 770 },
                { n: '6', sub: 'MNO', f: 852 },
                { n: '7', sub: 'PQRS', f: 697 },
                { n: '8', sub: 'TUV', f: 770 },
                { n: '9', sub: 'WXYZ', f: 852 },
                { n: '*', sub: '', f: 941 },
                { n: '0', sub: '+', f: 941 },
                { n: '#', sub: '', f: 941 },
              ].map(k => (
                <button
                  key={k.n}
                  onClick={() => handleKeypadPress(k.n, k.f)}
                  className="w-16 h-16 rounded-full bg-neutral-900 hover:bg-neutral-800 active:bg-cyan-950 flex flex-col items-center justify-center mx-auto transition-transform active:scale-95 border border-neutral-800"
                >
                  <span className="text-xl font-bold leading-none">{k.n}</span>
                  {k.sub && <span className="text-[9px] tracking-widest text-neutral-400 font-mono mt-0.5">{k.sub}</span>}
                </button>
              ))}
            </div>

            {/* Call button & delete */}
            <div className="flex items-center justify-center gap-6 mt-4 w-64">
              <div className="w-10" />
              <button
                onClick={() => onStartCall(dialNumber || 'Direct Dial', dialNumber || '+1 (555) 012-3456')}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
              >
                <Phone className="w-7 h-7" />
              </button>
              {dialNumber ? (
                <button
                  onClick={() => setDialNumber(prev => prev.slice(0, -1))}
                  className="text-xs font-mono text-neutral-400 hover:text-white px-2 py-1"
                >
                  Delete
                </button>
              ) : (
                <div className="w-10" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <div className="grid grid-cols-4 border-t border-neutral-800 bg-neutral-950 py-2 px-1">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center py-1 transition-colors ${activeTab === 'favorites' ? 'text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Star className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Favorites</span>
        </button>
        <button
          onClick={() => setActiveTab('recents')}
          className={`flex flex-col items-center py-1 transition-colors ${activeTab === 'recents' ? 'text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Clock className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Recents</span>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center py-1 transition-colors ${activeTab === 'contacts' ? 'text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Contacts</span>
        </button>
        <button
          onClick={() => setActiveTab('keypad')}
          className={`flex flex-col items-center py-1 transition-colors ${activeTab === 'keypad' ? 'text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Grid className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Keypad</span>
        </button>
      </div>
    </div>
  );
};
