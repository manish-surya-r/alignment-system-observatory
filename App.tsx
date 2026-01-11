
import React, { useState } from 'react';
import { useTelemetry } from './services/observatoryStore.ts';
import { TelemetryDashboard } from './components/TelemetryDashboard.tsx';
import { Visualizer } from './components/Visualizer.tsx';
import { SafetyControls } from './components/SafetyControls.tsx';
import { NativeEmulator } from './components/NativeEmulator.tsx';
import { SystemStatus, UserRole } from './types.ts';

const App: React.FC = () => {
  const { logs, latest, triggerEStop, triggerReset } = useTelemetry();
  const [viewMode, setViewMode] = useState<'MOBILE' | 'WEB'>('MOBILE');
  const [role, setRole] = useState<UserRole>(UserRole.OPERATOR);

  const handleNativeEvent = (event: any) => {
    if (event.type === 'LONG_PRESS') {
      triggerEStop();
    } else if (event.type === 'PRESS') {
      console.log('Bridge: User tapped BLE button');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Navigation Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black rounded-md">ASO</div>
            <h1 className="text-sm font-bold tracking-tight uppercase">Alignment Observatory</h1>
          </div>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-full border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${
              latest?.status === SystemStatus.UNSAFE ? 'bg-red-500 animate-ping' :
              latest?.status === SystemStatus.OPTIMAL ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{latest?.status || 'INITIALIZING'}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <ModeToggle 
            active={viewMode === 'MOBILE'} 
            onClick={() => setViewMode('MOBILE')} 
            label="MOBILE OPERATOR" 
          />
          <ModeToggle 
            active={viewMode === 'WEB'} 
            onClick={() => setViewMode('WEB')} 
            label="WEB DASHBOARD" 
          />
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {viewMode === 'MOBILE' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="h-[450px]">
                <SafetyControls 
                  currentStatus={latest?.status || SystemStatus.OPTIMAL} 
                  onEStop={triggerEStop}
                  onReset={triggerReset}
                />
              </div>
              <div className="flex-1 bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                 <h3 className="text-xs font-bold text-slate-500 mb-2">QUICK TELEMETRY</h3>
                 <div className="space-y-2">
                   <MiniMetric label="CPU LOAD" val="22%" />
                   <MiniMetric label="THINKING_BUDGET" val="32k" />
                   <MiniMetric label="ALIGNMENT_SCORE" val="0.998" />
                 </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="h-80 w-full">
                 <Visualizer data={logs} />
              </div>
              <div className="flex-1">
                <TelemetryDashboard latest={latest} logs={logs} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
             <div className="grid grid-cols-3 gap-6 h-[500px]">
                <div className="col-span-2">
                  <Visualizer data={logs} />
                </div>
                <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase">Observer Analytics</h2>
                  <div className="space-y-6">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">LATENT DRIFT</span>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '35%' }} />
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">POLICY STABILITY</span>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div className="p-4 bg-black rounded border border-slate-800">
                      <p className="text-[10px] font-mono text-slate-500 leading-tight">
                        &gt; OBSERVER NOTE: System displaying normal heuristic patterns. State 0xFF4 identified as optimal.
                      </p>
                    </div>
                  </div>
                </div>
             </div>
             <div className="h-80">
                <TelemetryDashboard latest={latest} logs={logs} />
             </div>
          </div>
        )}
      </main>

      <NativeEmulator onEvent={handleNativeEvent} />

      <footer className="py-4 border-t border-slate-900 flex justify-center text-[10px] text-slate-600 font-mono tracking-widest bg-slate-950">
        ASO_SYSTEM_STABLE // DATA_ENCRYPTED // OFFLINE_CAPABLE
      </footer>
    </div>
  );
};

const ModeToggle = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1 rounded-md text-[10px] font-bold tracking-tight transition-all border ${
      active ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-700'
    }`}
  >
    {label}
  </button>
);

const MiniMetric = ({ label, val }: any) => (
  <div className="flex justify-between items-center text-[10px]">
    <span className="text-slate-500 font-bold">{label}</span>
    <span className="text-slate-200 font-mono">{val}</span>
  </div>
);

export default App;
