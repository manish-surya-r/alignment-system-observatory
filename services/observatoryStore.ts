
import { useState, useEffect, useCallback, useRef } from 'react';
import { SystemStatus, TelemetryData, UserRole } from '../types.ts';

class ObservatoryBackend {
  private listeners: Set<(data: TelemetryData) => void> = new Set();
  private history: TelemetryData[] = [];
  private currentStatus: SystemStatus = SystemStatus.OPTIMAL;

  constructor() {
    this.startSimulation();
  }

  public subscribe(callback: (data: TelemetryData) => void) {
    this.listeners.add(callback);
    this.history.slice(-20).forEach(callback);
    // Explicitly returning void in the cleanup function to prevent TypeScript errors in useEffect
    return () => {
      this.listeners.delete(callback);
    };
  }

  public publish(data: TelemetryData) {
    this.history.push(data);
    this.listeners.forEach(cb => cb(data));
  }

  public setStatus(status: SystemStatus) {
    this.currentStatus = status;
    const update: TelemetryData = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: status,
      confidence: status === SystemStatus.HALTED ? 0 : Math.random() * 0.2 + 0.8,
      entropy: Math.random() * 0.5,
      latentCoordinates: [Math.random() * 100, Math.random() * 100],
      description: `Manual override: System state set to ${status}`
    };
    this.publish(update);
  }

  private startSimulation() {
    setInterval(() => {
      if (this.currentStatus === SystemStatus.HALTED) return;

      const roll = Math.random();
      let nextStatus = this.currentStatus;
      if (roll > 0.95) nextStatus = SystemStatus.UNCERTAIN;
      else if (roll > 0.99) nextStatus = SystemStatus.UNSAFE;
      else if (roll < 0.1) nextStatus = SystemStatus.OPTIMAL;

      const data: TelemetryData = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        status: nextStatus,
        confidence: Math.random() * 0.3 + 0.7,
        entropy: Math.random() * 0.2,
        latentCoordinates: [Math.random() * 100, Math.random() * 100],
        description: `Telemetry sync at ${new Date().toLocaleTimeString()}`
      };
      this.publish(data);
    }, 2000);
  }
}

export const backend = new ObservatoryBackend();

export function useTelemetry() {
  const [logs, setLogs] = useState<TelemetryData[]>([]);
  const [latest, setLatest] = useState<TelemetryData | null>(null);

  useEffect(() => {
    // Subscribing to telemetry updates from the backend
    const unsubscribe = backend.subscribe((data) => {
      setLogs(prev => [...prev.slice(-49), data]);
      setLatest(data);
    });
    return unsubscribe;
  }, []);

  const triggerEStop = useCallback(() => {
    backend.setStatus(SystemStatus.HALTED);
  }, []);

  const triggerReset = useCallback(() => {
    backend.setStatus(SystemStatus.OPTIMAL);
  }, []);

  return { logs, latest, triggerEStop, triggerReset };
}
