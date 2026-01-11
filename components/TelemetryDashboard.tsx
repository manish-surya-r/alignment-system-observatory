
import React from 'react';
import { TelemetryData, SystemStatus } from '../types';

interface Props {
  latest: TelemetryData | null;
  logs: TelemetryData[];
}

export const TelemetryDashboard: React.FC<Props> = ({ latest, logs }) => {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          label="SYSTEM CONFIDENCE" 
          value={`${((latest?.confidence || 0) * 100).toFixed(1)}%`} 
          status={latest?.status}
        />
        <MetricCard 
          label="LATENT ENTROPY" 
          value={(latest?.entropy || 0).toFixed(4)} 
          status={latest?.status}
        />
        <MetricCard 
          label="ACTIVE NODES" 
          value="1,024" 
        />
        <MetricCard 
          label="UPTIME" 
          value="42h 12m" 
        />
      </div>

      {/* Real-time Logs */}
      <div className="flex-1 min-h-0 bg-black border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-y-auto">
        <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1 flex justify-between">
          <span>EVENT STREAM_LOG</span>
          <span>RELIABILITY: HIGH</span>
        </div>
        {[...logs].reverse().map((log) => (
          <div key={log.id} className="mb-1 flex gap-4">
            <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={
              log.status === SystemStatus.UNSAFE ? 'text-red-500 font-bold' : 
              log.status === SystemStatus.UNCERTAIN ? 'text-yellow-500' : 'text-green-500'
            }>
              {log.status}
            </span>
            <span className="text-slate-300 truncate">{log.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, status }: { label: string, value: string, status?: SystemStatus }) => (
  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col justify-center">
    <span className="text-[10px] text-slate-500 font-bold tracking-widest">{label}</span>
    <span className={`text-xl font-mono font-bold ${
      status === SystemStatus.UNSAFE ? 'text-red-500' :
      status === SystemStatus.UNCERTAIN ? 'text-yellow-500' :
      'text-slate-100'
    }`}>{value}</span>
  </div>
);
