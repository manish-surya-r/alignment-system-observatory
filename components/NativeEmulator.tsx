
import React, { useState } from 'react';
import { NativeBridgeEvent } from '../types';

interface Props {
  onEvent: (event: NativeBridgeEvent) => void;
}

export const NativeEmulator: React.FC<Props> = ({ onEvent }) => {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleAction = (type: 'PRESS' | 'LONG_PRESS') => {
    onEvent({
      type,
      timestamp: Date.now(),
      source: 'BLE_BUTTON'
    });
    setLastAction(type);
    setTimeout(() => setLastAction(null), 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 w-48 transition-all hover:scale-105">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kotlin Bridge Sim</span>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
             <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onMouseDown={() => handleAction('PRESS')}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold border-b-2 border-slate-900 active:border-b-0 active:translate-y-0.5"
          >
            TAP
          </button>
          <button 
            onContextMenu={(e) => { e.preventDefault(); handleAction('LONG_PRESS'); }}
            onMouseDown={(e) => {
              const timer = setTimeout(() => handleAction('LONG_PRESS'), 1000);
              const cancel = () => clearTimeout(timer);
              window.addEventListener('mouseup', cancel, { once: true });
            }}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 rounded-lg text-[10px] font-bold border-b-2 border-black active:border-b-0 active:translate-y-0.5"
          >
            HOLD
          </button>
        </div>

        {lastAction && (
          <div className="text-center text-[8px] font-mono text-blue-400 animate-bounce">
            EMITTING: {lastAction}
          </div>
        )}
      </div>
    </div>
  );
};
