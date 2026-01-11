
import React from 'react';
import { SystemStatus } from '../types';

interface Props {
  currentStatus: SystemStatus;
  onEStop: () => void;
  onReset: () => void;
}

export const SafetyControls: React.FC<Props> = ({ currentStatus, onEStop, onReset }) => {
  const isHalted = currentStatus === SystemStatus.HALTED;

  return (
    <div className="flex flex-col gap-6 h-full p-4 bg-slate-900/50 rounded-xl border border-slate-800">
      <div className="text-sm font-bold tracking-tighter text-slate-400 mb-2">HMI OVERRIDE INTERFACE</div>
      
      <div className="flex-1 flex flex-col gap-4">
        <button 
          onClick={onEStop}
          className={`w-full py-12 rounded-2xl flex flex-col items-center justify-center gap-2 border-4 transition-all active:scale-95 ${
            isHalted 
              ? 'bg-red-950/20 border-red-500 text-red-500' 
              : 'bg-red-600 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:bg-red-500'
          }`}
        >
          <span className="text-4xl font-black">E-STOP</span>
          <span className="text-xs font-bold opacity-80">EMERGENCY SHUTDOWN</span>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <ControlButton 
            label="RECOVER" 
            subLabel="Resume Ops" 
            active={isHalted} 
            onClick={onReset}
            color="emerald"
          />
          <ControlButton 
            label="DEBUG" 
            subLabel="Enter Verbose" 
            onClick={() => alert('DEBUG_MODE ENABLED')}
            color="blue"
          />
        </div>

        <div className="mt-auto p-4 bg-black/40 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              currentStatus === SystemStatus.UNSAFE ? 'bg-red-500' :
              currentStatus === SystemStatus.OPTIMAL ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className="text-[10px] font-bold text-slate-500">OPERATOR RESPONSIBILITY STATUS</span>
          </div>
          <p className="text-[10px] leading-tight text-slate-400 uppercase">
            All overrides are logged with hardware timestamp. By clicking E-STOP, physical containment protocols are initiated.
          </p>
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ label, subLabel, onClick, color, active = true }: any) => {
  const colorMap: any = {
    emerald: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400',
    blue: 'bg-blue-700 hover:bg-blue-600 text-white border-blue-500',
    slate: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
  };

  return (
    <button 
      disabled={!active}
      onClick={onClick}
      className={`p-4 rounded-xl border-b-4 flex flex-col transition-all active:translate-y-1 active:border-b-0 disabled:opacity-30 disabled:grayscale ${colorMap[color]}`}
    >
      <span className="text-sm font-black tracking-tight">{label}</span>
      <span className="text-[9px] font-bold uppercase opacity-70">{subLabel}</span>
    </button>
  );
};
