export interface RouterStatus {
  id: number;
  online: boolean;
  lastPing?: Date;
  ipAddress?: string;
  uptime?: string;
}

export interface RouterDetails {
  id: number;
  name: string;
  model?: string;
  serialNumber?: string;
  macAddress?: string;
  connectionString?: string;
  firmware?: string;
  firmwareStatus?: 'up-to-date' | 'update-available' | 'rc' | 'outdated';
  cpuUsage?: number;
  ramUsage?: number;
  diskUsage?: number;
  interfaces?: RouterInterface[];
  tags?: string[];
  location?: string;
  routerboardUpgrade?: boolean;
  sstp?: SstpConnectionStatus;
  lastSeen?: Date;
  notes?: string;
}

export interface RouterInterface {
  name: string;
  type: string;
  running: boolean;
  macAddress?: string;
  ipAddresses?: string[];
  rxBytes?: number;
  txBytes?: number;
}

export interface SstpConnectionStatus {
  connected: boolean;
  vpnAddress?: string;
  vpnPort?: number;
  username?: string;
  lastConnected?: Date;
}

export interface SubscriberInfo {
  id: number;
  email: string;
  active: boolean;
  routerId: number;
  createdAt: Date;
}

export interface StorageStats {
  backupsSize: number;
  systemFilesSize: number;
  totalSize: number;
  availableFeatures: string[];
}

export interface TransferStats {
  dailyTransfer: number;
  devices: {
    name: string;
    usage: number;
    color: string;
  }[];
  history: {
    timestamp: Date;
    traffic: number;
  }[];
}

export interface RouterCreationParams {
  name: string;
  ipAddress: string;
  username: string;
  password: string;
  sshPort?: number;
  apiPort?: number;
  createSstpTunnel: boolean;
}

export interface FleetCommandParams {
  command: string;
  routerIds: number[];
  scheduledTime?: Date;
  description?: string;
}

export interface FirmwareUpdateParams {
  routerIds: number[];
  targetVersion?: string;
  updatePackages: boolean;
  updateRouterboard: boolean;
  scheduledTime?: Date;
}

export interface TagInfo {
  id: number;
  name: string;
  color?: string;
  routerCount?: number;
}

export interface RouterHealthStatus {
  id: number;
  routerId: number;
  cpuLoad: number[];
  memoryUsage: number;
  diskUsage: number;
  temperature?: number;
  voltage?: number;
  uptimeSeconds: number;
  timestamp: Date;
}

export interface BackupInfo {
  id: number;
  routerId: number;
  name: string;
  size: number;
  createdAt: Date;
  configurationDiff?: string;
}

export interface MeshLabInfo {
  id: number;
  name: string;
  routerId: number;
  subscribers: SubscriberInfo[];
  displayBandwidthLimits: boolean;
  billingId?: string;
}

export interface WebSocketMessage {
  type: 'routerStatus' | 'resourceUpdate' | 'notification' | 'commandResult';
  payload: any;
}

export interface NotificationMessage {
  id: number;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  routerId?: number;
  timestamp: Date;
  read: boolean;
}
