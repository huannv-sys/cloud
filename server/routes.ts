import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import { 
  insertRouterSchema, 
  insertSubscriberSchema, 
  insertTagSchema, 
  insertCommandSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    // Send initial data
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'connected',
        payload: { message: 'Connected to Admiral WebSocket' }
      }));
    }
    
    // Handle incoming messages
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'subscribe') {
          console.log(`Client subscribed to ${data.topic}`);
          // Handle subscription logic
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // Broadcast router status updates to connected clients
  function broadcastRouterUpdate(routerId: number, data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'routerUpdate',
          routerId,
          payload: data
        }));
      }
    });
  }
  
  // Router management API endpoints
  app.get('/api/routers', async (req: Request, res: Response) => {
    try {
      const routers = await storage.getRouters();
      res.json(routers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching routers' });
    }
  });
  
  app.get('/api/routers/:id', async (req: Request, res: Response) => {
    try {
      const routerId = parseInt(req.params.id);
      const router = await storage.getRouter(routerId);
      
      if (!router) {
        return res.status(404).json({ message: 'Router not found' });
      }
      
      res.json(router);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching router' });
    }
  });
  
  app.post('/api/routers', async (req: Request, res: Response) => {
    try {
      const validationResult = insertRouterSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid router data', errors: validationResult.error.errors });
      }
      
      const router = await storage.createRouter(validationResult.data);
      res.status(201).json(router);
    } catch (error) {
      res.status(500).json({ message: 'Error creating router' });
    }
  });
  
  app.patch('/api/routers/:id', async (req: Request, res: Response) => {
    try {
      const routerId = parseInt(req.params.id);
      const router = await storage.getRouter(routerId);
      
      if (!router) {
        return res.status(404).json({ message: 'Router not found' });
      }
      
      const updatedRouter = await storage.updateRouter(routerId, req.body);
      
      // Broadcast the update to WebSocket clients
      broadcastRouterUpdate(routerId, updatedRouter);
      
      res.json(updatedRouter);
    } catch (error) {
      res.status(500).json({ message: 'Error updating router' });
    }
  });
  
  app.delete('/api/routers/:id', async (req: Request, res: Response) => {
    try {
      const routerId = parseInt(req.params.id);
      const deleted = await storage.deleteRouter(routerId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Router not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting router' });
    }
  });
  
  // Router status endpoints
  app.get('/api/routers/:id/status', async (req: Request, res: Response) => {
    try {
      const routerId = parseInt(req.params.id);
      const status = await storage.getRouterStatus(routerId);
      
      if (!status) {
        return res.status(404).json({ message: 'Router status not found' });
      }
      
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching router status' });
    }
  });
  
  app.get('/api/routers/:id/details', async (req: Request, res: Response) => {
    try {
      const routerId = parseInt(req.params.id);
      const details = await storage.getRouterDetails(routerId);
      
      if (!details) {
        return res.status(404).json({ message: 'Router details not found' });
      }
      
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching router details' });
    }
  });
  
  // Subscriber management API endpoints
  app.get('/api/subscribers', async (req: Request, res: Response) => {
    try {
      const routerId = req.query.routerId ? parseInt(req.query.routerId as string) : undefined;
      const subscribers = await storage.getSubscribers(routerId);
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching subscribers' });
    }
  });
  
  app.post('/api/subscribers', async (req: Request, res: Response) => {
    try {
      const validationResult = insertSubscriberSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid subscriber data', errors: validationResult.error.errors });
      }
      
      const subscriber = await storage.createSubscriber(validationResult.data);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(500).json({ message: 'Error creating subscriber' });
    }
  });
  
  app.patch('/api/subscribers/:id', async (req: Request, res: Response) => {
    try {
      const subscriberId = parseInt(req.params.id);
      const { active } = req.body;
      
      if (typeof active !== 'boolean') {
        return res.status(400).json({ message: 'Invalid active status' });
      }
      
      const subscriber = await storage.updateSubscriber(subscriberId, active);
      
      if (!subscriber) {
        return res.status(404).json({ message: 'Subscriber not found' });
      }
      
      res.json(subscriber);
    } catch (error) {
      res.status(500).json({ message: 'Error updating subscriber' });
    }
  });
  
  app.delete('/api/subscribers/:id', async (req: Request, res: Response) => {
    try {
      const subscriberId = parseInt(req.params.id);
      const deleted = await storage.deleteSubscriber(subscriberId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Subscriber not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting subscriber' });
    }
  });
  
  // Tag management API endpoints
  app.get('/api/tags', async (req: Request, res: Response) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tags' });
    }
  });
  
  app.post('/api/tags', async (req: Request, res: Response) => {
    try {
      const validationResult = insertTagSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid tag data', errors: validationResult.error.errors });
      }
      
      const tag = await storage.createTag(validationResult.data);
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ message: 'Error creating tag' });
    }
  });
  
  app.delete('/api/tags/:id', async (req: Request, res: Response) => {
    try {
      const tagId = parseInt(req.params.id);
      const deleted = await storage.deleteTag(tagId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Tag not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tag' });
    }
  });
  
  // Command management API endpoints
  app.get('/api/commands', async (req: Request, res: Response) => {
    try {
      const commands = await storage.getCommands();
      res.json(commands);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching commands' });
    }
  });
  
  app.post('/api/commands', async (req: Request, res: Response) => {
    try {
      const validationResult = insertCommandSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid command data', errors: validationResult.error.errors });
      }
      
      const command = await storage.createCommand(validationResult.data);
      res.status(201).json(command);
    } catch (error) {
      res.status(500).json({ message: 'Error creating command' });
    }
  });
  
  // Statistics API endpoints
  app.get('/api/stats/storage', async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStorageStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching storage stats' });
    }
  });
  
  app.get('/api/stats/transfer', async (req: Request, res: Response) => {
    try {
      const stats = await storage.getTransferStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transfer stats' });
    }
  });
  
  // Notifications API endpoints
  app.get('/api/notifications', async (req: Request, res: Response) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  });
  
  app.patch('/api/notifications/:id/read', async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);
      const marked = await storage.markNotificationAsRead(notificationId);
      
      if (!marked) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error marking notification as read' });
    }
  });
  
  // Mesh Lab API endpoints
  app.get('/api/mesh-labs', async (req: Request, res: Response) => {
    try {
      const meshLabs = await storage.getMeshLabs();
      res.json(meshLabs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching mesh labs' });
    }
  });
  
  app.get('/api/mesh-labs/:id', async (req: Request, res: Response) => {
    try {
      const meshLabId = parseInt(req.params.id);
      const meshLab = await storage.getMeshLab(meshLabId);
      
      if (!meshLab) {
        return res.status(404).json({ message: 'Mesh lab not found' });
      }
      
      res.json(meshLab);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching mesh lab' });
    }
  });

  return httpServer;
}
