
export enum SystemStatus {
  OPTIMAL = 'OPTIMAL',
  UNCERTAIN = 'UNCERTAIN',
  UNSAFE = 'UNSAFE',
  HALTED = 'HALTED',
  RECOVERY = 'RECOVERY'
}

export enum UserRole {
  OPERATOR = 'OPERATOR', // Full control
  OBSERVER = 'OBSERVER'  // View only
}

export interface TelemetryData {
  id: string;
  timestamp: number;
  status: SystemStatus;
  confidence: number;
  entropy: number;
  latentCoordinates: [number, number];
  description: string;
}

export interface NativeBridgeEvent {
  type: 'PRESS' | 'LONG_PRESS';
  timestamp: number;
  source: 'BLE_BUTTON';
}
