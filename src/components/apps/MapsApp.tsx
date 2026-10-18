import React, { useState } from 'react';
import { Navigation, Compass, MapPin, Search, ArrowUpRight, Shield } from 'lucide-react';

interface MapsAppProps {
  destination?: string;
}

export const MapsApp: React.FC<MapsAppProps> = ({ destination = 'Stark Tower Lab' }) => {
  const [search, setSearch] = useState(destination);
  const [isNavigating, setIsNavigating] = useState(true);

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col justify-between overflow-hidden relative">
      {/* Top Search & Destination Overlay */}
      <div className="z-20 p-3 bg-gradient-to-b from-neutral-950 via-neutral-950/90 to-transparent">
        <div className="relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {isNavigating && (
          <div className="bg-cyan-950/80 border border-cyan-500/40 rounded-2xl p-3 backdrop-blur-md shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5 fill-black" />
              </div>
              <div>
                <div className="text-[10px] text-cyan-300 font-mono flex items-center gap-1">
                  <span>In 400 ft • Turn Right</span>
                  <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-xs font-bold text-white truncate max-w-[150px]">
                  {search || 'Quantum Way Ave'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-emerald-400">14 min</div>
              <div className="text-[10px] text-neutral-400 font-mono">5.2 mi • 11:28 AM</div>
            </div>
          </div>
        )}
      </div>

      {/* Futuristic Vector Map Graphic */}
      <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden">
        {/* Holographic road grid simulation */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Stylized vector roads */}
        <svg className="w-full h-full text-cyan-500/30" viewBox="0 0 300 500" fill="none">
          <path d="M50 0 L50 500" stroke="currentColor" strokeWidth="6" strokeDasharray="8 6" />
          <path d="M220 0 L220 500" stroke="currentColor" strokeWidth="4" />
          <path d="M0 180 L300 180" stroke="currentColor" strokeWidth="8" />
          <path d="M0 340 L300 340" stroke="currentColor" strokeWidth="6" />
          
          {/* Active Navigation Route Line (Glowing Cyan) */}
          <path
            d="M150 420 L150 340 L220 340 L220 180 L180 140"
            stroke="#22d3ee"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_8px_#22d3ee]"
          />
        </svg>

        {/* User Vehicle Indicator */}
        <div className="absolute top-[390px] left-[138px] flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_15px_#22d3ee] animate-pulse">
            <Navigation className="w-3.5 h-3.5 fill-black -rotate-45" />
          </div>
        </div>

        {/* Destination Pin */}
        <div className="absolute top-[125px] left-[170px] flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
            <MapPin className="w-3.5 h-3.5 fill-white" />
          </div>
        </div>
      </div>

      {/* Bottom Floating Card */}
      <div className="z-20 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin [animation-duration:12s]" />
            <div>
              <div className="text-xs font-semibold text-white">Live Jarvis Satellite Guidance</div>
              <div className="text-[10px] text-neutral-400 font-mono">No traffic delays reported</div>
            </div>
          </div>
          <button
            onClick={() => setIsNavigating(!isNavigating)}
            className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-semibold"
          >
            {isNavigating ? 'End' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};
