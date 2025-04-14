import { 
  User, InsertUser, 
  Router, InsertRouter, 
  Backup, InsertBackup, 
  Subscriber, InsertSubscriber, 
  Tag, InsertTag, 
  Command, InsertCommand, 
  FirmwareHistory, InsertFirmwareHistory 
} from "@shared/schema";
import { 
  RouterStatus, 
  RouterDetails, 
  StorageStats, 
  TransferStats, 
  NotificationMessage, 
  MeshLabInfo 
} from "@shared/types";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Router management
  getRouters(): Promise<Router[]>;
  getRouter(id: number): Promise<Router | undefined>;
  createRouter(router: InsertRouter): Promise<Router>;
  updateRouter(id: number, router: Partial<InsertRouter>): Promise<Router | undefined>;
  deleteRouter(id: number): Promise<boolean>;
  
  // Router status and details
  getRouterStatus(id: number): Promise<RouterStatus | undefined>;
  getRouterDetails(id: number): Promise<RouterDetails | undefined>;
  updateRouterStatus(id: number, online: boolean): Promise<RouterStatus | undefined>;
  
  // Backup management
  getBackups(routerId?: number): Promise<Backup[]>;
  getBackup(id: number): Promise<Backup | undefined>;
  createBackup(backup: InsertBackup): Promise<Backup>;
  deleteBackup(id: number): Promise<boolean>;
  
  // Subscriber management
  getSubscribers(routerId?: number): Promise<Subscriber[]>;
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: number, active: boolean): Promise<Subscriber | undefined>;
  deleteSubscriber(id: number): Promise<boolean>;
  
  // Tag management
  getTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: number): Promise<boolean>;
  
  // Command management
  getCommands(): Promise<Command[]>;
  getCommand(id: number): Promise<Command | undefined>;
  createCommand(command: InsertCommand): Promise<Command>;
  deleteCommand(id: number): Promise<boolean>;
  
  // Firmware management
  getFirmwareHistory(routerId?: number): Promise<FirmwareHistory[]>;
  createFirmwareHistory(history: InsertFirmwareHistory): Promise<FirmwareHistory>;
  
  // Statistics
  getStorageStats(): Promise<StorageStats>;
  getTransferStats(): Promise<TransferStats>;
  
  // Notifications
  getNotifications(): Promise<NotificationMessage[]>;
  markNotificationAsRead(id: number): Promise<boolean>;
  
  // Mesh Lab management
  getMeshLabs(): Promise<MeshLabInfo[]>;
  getMeshLab(id: number): Promise<MeshLabInfo | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private routers: Map<number, Router>;
  private backups: Map<number, Backup>;
  private subscribers: Map<number, Subscriber>;
  private tags: Map<number, Tag>;
  private commands: Map<number, Command>;
  private firmwareHistory: Map<number, FirmwareHistory>;
  private routerStatus: Map<number, RouterStatus>;
  private routerDetails: Map<number, RouterDetails>;
  private notifications: Map<number, NotificationMessage>;
  private meshLabs: Map<number, MeshLabInfo>;
  
  private currentUserId: number;
  private currentRouterId: number;
  private currentBackupId: number;
  private currentSubscriberId: number;
  private currentTagId: number;
  private currentCommandId: number;
  private currentFirmwareHistoryId: number;
  private currentNotificationId: number;
  private currentMeshLabId: number;

  constructor() {
    this.users = new Map();
    this.routers = new Map();
    this.backups = new Map();
    this.subscribers = new Map();
    this.tags = new Map();
    this.commands = new Map();
    this.firmwareHistory = new Map();
    this.routerStatus = new Map();
    this.routerDetails = new Map();
    this.notifications = new Map();
    this.meshLabs = new Map();
    
    this.currentUserId = 1;
    this.currentRouterId = 1;
    this.currentBackupId = 1;
    this.currentSubscriberId = 1;
    this.currentTagId = 1;
    this.currentCommandId = 1;
    this.currentFirmwareHistoryId = 1;
    this.currentNotificationId = 1;
    this.currentMeshLabId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Router management
  async getRouters(): Promise<Router[]> {
    return Array.from(this.routers.values());
  }
  
  async getRouter(id: number): Promise<Router | undefined> {
    return this.routers.get(id);
  }
  
  async createRouter(insertRouter: InsertRouter): Promise<Router> {
    const id = this.currentRouterId++;
    const router: Router = { ...insertRouter, id, createdAt: new Date() };
    this.routers.set(id, router);
    
    // Also create a status entry
    this.routerStatus.set(id, {
      id,
      online: insertRouter.online || false,
      lastPing: new Date(),
      ipAddress: insertRouter.ipAddress
    });
    
    // And details entry
    this.routerDetails.set(id, {
      id,
      name: insertRouter.name,
      model: insertRouter.model,
      macAddress: insertRouter.macAddress,
      connectionString: insertRouter.connectionString,
      firmware: insertRouter.firmware,
      cpuUsage: insertRouter.cpuUsage,
      ramUsage: insertRouter.ramUsage,
      diskUsage: insertRouter.diskUsage,
      tags: insertRouter.tags,
      location: insertRouter.location,
      lastSeen: new Date(),
      notes: insertRouter.notes
    });
    
    return router;
  }
  
  async updateRouter(id: number, routerUpdate: Partial<InsertRouter>): Promise<Router | undefined> {
    const router = this.routers.get(id);
    if (!router) return undefined;
    
    const updatedRouter = { ...router, ...routerUpdate };
    this.routers.set(id, updatedRouter);
    
    // Also update status and details if needed
    if (routerUpdate.online !== undefined) {
      const status = this.routerStatus.get(id);
      if (status) {
        this.routerStatus.set(id, { ...status, online: routerUpdate.online });
      }
    }
    
    // Update router details
    const details = this.routerDetails.get(id);
    if (details) {
      this.routerDetails.set(id, { ...details, ...routerUpdate });
    }
    
    return updatedRouter;
  }
  
  async deleteRouter(id: number): Promise<boolean> {
    const deleted = this.routers.delete(id);
    
    // Also remove status and details
    this.routerStatus.delete(id);
    this.routerDetails.delete(id);
    
    return deleted;
  }
  
  // Router status and details
  async getRouterStatus(id: number): Promise<RouterStatus | undefined> {
    return this.routerStatus.get(id);
  }
  
  async getRouterDetails(id: number): Promise<RouterDetails | undefined> {
    return this.routerDetails.get(id);
  }
  
  async updateRouterStatus(id: number, online: boolean): Promise<RouterStatus | undefined> {
    const status = this.routerStatus.get(id);
    if (!status) return undefined;
    
    const updatedStatus = { ...status, online, lastPing: new Date() };
    this.routerStatus.set(id, updatedStatus);
    
    // Also update the router
    const router = this.routers.get(id);
    if (router) {
      this.routers.set(id, { ...router, online });
    }
    
    return updatedStatus;
  }
  
  // Backup management
  async getBackups(routerId?: number): Promise<Backup[]> {
    const backups = Array.from(this.backups.values());
    if (routerId !== undefined) {
      return backups.filter(backup => backup.routerId === routerId);
    }
    return backups;
  }
  
  async getBackup(id: number): Promise<Backup | undefined> {
    return this.backups.get(id);
  }
  
  async createBackup(insertBackup: InsertBackup): Promise<Backup> {
    const id = this.currentBackupId++;
    const backup: Backup = { ...insertBackup, id, createdAt: new Date() };
    this.backups.set(id, backup);
    return backup;
  }
  
  async deleteBackup(id: number): Promise<boolean> {
    return this.backups.delete(id);
  }
  
  // Subscriber management
  async getSubscribers(routerId?: number): Promise<Subscriber[]> {
    const subscribers = Array.from(this.subscribers.values());
    if (routerId !== undefined) {
      return subscribers.filter(sub => sub.routerId === routerId);
    }
    return subscribers;
  }
  
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentSubscriberId++;
    const subscriber: Subscriber = { ...insertSubscriber, id, createdAt: new Date() };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  async updateSubscriber(id: number, active: boolean): Promise<Subscriber | undefined> {
    const subscriber = this.subscribers.get(id);
    if (!subscriber) return undefined;
    
    const updatedSubscriber = { ...subscriber, active };
    this.subscribers.set(id, updatedSubscriber);
    return updatedSubscriber;
  }
  
  async deleteSubscriber(id: number): Promise<boolean> {
    return this.subscribers.delete(id);
  }
  
  // Tag management
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.currentTagId++;
    const tag: Tag = { ...insertTag, id, createdAt: new Date() };
    this.tags.set(id, tag);
    return tag;
  }
  
  async deleteTag(id: number): Promise<boolean> {
    return this.tags.delete(id);
  }
  
  // Command management
  async getCommands(): Promise<Command[]> {
    return Array.from(this.commands.values());
  }
  
  async getCommand(id: number): Promise<Command | undefined> {
    return this.commands.get(id);
  }
  
  async createCommand(insertCommand: InsertCommand): Promise<Command> {
    const id = this.currentCommandId++;
    const command: Command = { ...insertCommand, id, createdAt: new Date() };
    this.commands.set(id, command);
    return command;
  }
  
  async deleteCommand(id: number): Promise<boolean> {
    return this.commands.delete(id);
  }
  
  // Firmware management
  async getFirmwareHistory(routerId?: number): Promise<FirmwareHistory[]> {
    const history = Array.from(this.firmwareHistory.values());
    if (routerId !== undefined) {
      return history.filter(h => h.routerId === routerId);
    }
    return history;
  }
  
  async createFirmwareHistory(insertHistory: InsertFirmwareHistory): Promise<FirmwareHistory> {
    const id = this.currentFirmwareHistoryId++;
    const history: FirmwareHistory = { ...insertHistory, id, updatedAt: new Date() };
    this.firmwareHistory.set(id, history);
    return history;
  }
  
  // Statistics
  async getStorageStats(): Promise<StorageStats> {
    return {
      backupsSize: 8200000000, // 8.2GB
      systemFilesSize: 950000000, // 0.95GB
      totalSize: 9150000000, // 9.15GB
      availableFeatures: ['WinBox', 'WebSSH', 'Port Forwarding']
    };
  }
  
  async getTransferStats(): Promise<TransferStats> {
    return {
      dailyTransfer: 250000000, // 0.25GB
      devices: [
        { name: 'CloudBox-Air', usage: 200000000, color: '#2196f3' },
        { name: 'Roku 2 HD - S38', usage: 37500000, color: '#4caf50' },
        { name: 'CE-CA-31-E1-61-80', usage: 12500000, color: '#f48fb1' }
      ],
      history: [
        { timestamp: new Date(), traffic: 250000000 }
      ]
    };
  }
  
  // Notifications
  async getNotifications(): Promise<NotificationMessage[]> {
    return Array.from(this.notifications.values());
  }
  
  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.read = true;
    this.notifications.set(id, notification);
    return true;
  }
  
  // Mesh Lab management
  async getMeshLabs(): Promise<MeshLabInfo[]> {
    return Array.from(this.meshLabs.values());
  }
  
  async getMeshLab(id: number): Promise<MeshLabInfo | undefined> {
    return this.meshLabs.get(id);
  }
  
  // Initialize demo data
  private initializeDemoData() {
    // Create demo admin
    this.createUser({
      username: 'admin',
      password: 'password',
      email: 'admin@example.com',
      isAdmin: true
    });
    
    // Create tags
    const coreTag = this.createTag({ name: 'CORE', color: '#e0e0e0' });
    const homeTag = this.createTag({ name: 'Home', color: '#e0e0e0' });
    const georgiaTag = this.createTag({ name: 'Georgia', color: '#e0e0e0' });
    const towerTag = this.createTag({ name: 'TOWER', color: '#e0e0e0' });
    const stolenTag = this.createTag({ name: 'Stolen', color: '#e0e0e0' });
    const remoteTag = this.createTag({ name: 'Remote', color: '#e0e0e0' });
    const oldtownTag = this.createTag({ name: 'NY, Oldtown', color: '#e0e0e0' });
    const dspfTag = this.createTag({ name: 'DSPF', color: '#e0e0e0' });
    
    // Create routers
    this.createRouter({
      name: 'LAN CRS326',
      model: 'CRS326-24G-2S+',
      ipAddress: '192.168.1.1',
      macAddress: '00:11:22:33:44:55',
      connectionString: 'vpn1.remotewinbox.com:28483',
      online: true,
      firmware: '6.49.13',
      cpuUsage: 1,
      ramUsage: 13,
      diskUsage: 87,
      tags: ['CORE', 'Georgia'],
      location: 'Data Center',
      notes: 'Main router for LAN'
    });
    
    this.createRouter({
      name: 'WAN-CRS326',
      model: 'CRS326-24G-2S+',
      ipAddress: '10.0.0.1',
      macAddress: '00:11:22:33:44:56',
      connectionString: 'vpn1.remotewinbox.com:29384',
      online: true,
      firmware: '6.48.6',
      cpuUsage: 25,
      ramUsage: 13,
      diskUsage: 86,
      tags: ['CORE', 'Georgia', 'TOWER'],
      location: 'Tower',
      notes: 'Main WAN router'
    });
    
    this.createRouter({
      name: 'Mesh Lab 1',
      model: 'hAP ac²',
      ipAddress: '192.168.10.1',
      macAddress: '00:11:22:33:44:57',
      connectionString: 'vpn1.remotewinbox.com:45673',
      online: true,
      firmware: '7.14.3',
      cpuUsage: 5,
      ramUsage: 30,
      diskUsage: 30,
      tags: ['CORE', 'Home'],
      location: 'Office',
      notes: 'Lab mesh router'
    });
    
    this.createRouter({
      name: 'Home WiFi Main',
      model: 'hAP ac³',
      ipAddress: '192.168.88.1',
      macAddress: '00:11:22:33:44:58',
      connectionString: 'vpn1.remotewinbox.com:30987',
      online: false,
      firmware: '7.15rc2',
      cpuUsage: 1,
      ramUsage: 75,
      diskUsage: 31,
      tags: ['CORE', 'Home', 'Stolen', 'TOWER'],
      location: 'Home',
      notes: 'Main home WiFi router'
    });
    
    this.createRouter({
      name: 'Home WiFi extender',
      model: 'hAP ac lite',
      ipAddress: '192.168.88.2',
      macAddress: '00:11:22:33:44:59',
      connectionString: 'vpn1.remotewinbox.com:34569',
      online: true,
      firmware: '7.15rc2',
      cpuUsage: 2,
      ramUsage: 42,
      diskUsage: 76,
      tags: ['Home'],
      location: 'Home',
      notes: 'WiFi range extender'
    });
    
    // Create some mesh lab data
    this.meshLabs.set(1, {
      id: 1,
      name: 'Mesh Lab 1',
      routerId: 3,
      subscribers: [],
      displayBandwidthLimits: false
    });
    
    // Add subscribers to mesh lab
    const subscriber1 = this.createSubscriber({
      email: 'candice+subscriber11@remotewinbox.com',
      active: true,
      routerId: 3
    });
    
    const subscriber2 = this.createSubscriber({
      email: 'candice+subscriber2@remotewinbox.com',
      active: true,
      routerId: 3
    });
    
    // Update mesh lab with subscribers
    const meshLab = this.meshLabs.get(1);
    if (meshLab) {
      meshLab.subscribers = [subscriber1, subscriber2];
      this.meshLabs.set(1, meshLab);
    }
    
    // Create notification
    this.notifications.set(1, {
      id: 1,
      level: 'warning',
      message: 'Router "Home WiFi Main" is offline',
      routerId: 4,
      timestamp: new Date(),
      read: false
    });
  }
}

export const storage = new MemStorage();
