import React from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Server, Cpu, HardDrive, Wifi, RefreshCw, Clock, Signal, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RouterModelViewer } from '@/components/router-model-viewer';
import { PageHeader } from '@/components/page-header';

export default function RouterDetailsPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const routerId = parseInt(id);
  
  const { data: router, isLoading: routerLoading } = useQuery({
    queryKey: ['/api/routers', routerId],
    queryFn: () => fetch(`/api/routers/${routerId}`).then(res => res.json()),
    enabled: !!routerId && !isNaN(routerId),
  });
  
  const { data: details, isLoading: detailsLoading } = useQuery({
    queryKey: ['/api/routers', routerId, 'details'],
    queryFn: () => fetch(`/api/routers/${routerId}/details`).then(res => res.json()),
    enabled: !!routerId && !isNaN(routerId),
  });
  
  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/routers', routerId, 'status'],
    queryFn: () => fetch(`/api/routers/${routerId}/status`).then(res => res.json()),
    enabled: !!routerId && !isNaN(routerId),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const isLoading = routerLoading || detailsLoading || statusLoading;
  
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Loading Router Details...</h1>
          <p className="text-muted-foreground">Retrieving router information</p>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="h-20 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!router || !details || !status) {
    return (
      <div className="container py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Router Not Found</h1>
          <p className="text-muted-foreground">The router you're looking for doesn't exist or you don't have access to it.</p>
        </div>
        <Button onClick={() => setLocation('/routers')}>Back to Router List</Button>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <PageHeader
        title={router.name}
        description={`Model: ${router.model || 'Unknown'} • IP: ${router.ipAddress}`}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setLocation('/routers')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Button>
            <Button>Connect</Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection</span>
                <Badge variant={status.online ? "success" : "destructive"}>
                  {status.online ? "Online" : "Offline"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Seen</span>
                <span className="text-sm">{status.lastPing ? new Date(status.lastPing).toLocaleString() : 'Never'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm">{status.uptime || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Firmware</span>
                <Badge variant={
                  details.firmwareStatus === 'up-to-date' ? 'success' : 
                  details.firmwareStatus === 'update-available' ? 'warning' : 
                  details.firmwareStatus === 'rc' ? 'default' :
                  'outline'
                }>
                  {details.firmware || 'Unknown'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Serial Number</span>
                <span className="text-sm">{details.serialNumber || 'N/A'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">MAC Address</span>
                <span className="text-sm">{details.macAddress || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm">{details.cpuUsage ? `${details.cpuUsage}%` : 'N/A'}</span>
                </div>
                <Progress value={details.cpuUsage || 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm">{details.ramUsage ? `${details.ramUsage}%` : 'N/A'}</span>
                </div>
                <Progress value={details.ramUsage || 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Disk Usage</span>
                  <span className="text-sm">{details.diskUsage ? `${details.diskUsage}%` : 'N/A'}</span>
                </div>
                <Progress value={details.diskUsage || 0} className="h-2" />
              </div>
              
              {details.location && (
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Location</span>
                  </div>
                  <span className="text-sm">{details.location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection String</span>
                <span className="text-sm">{details.connectionString || router.ipAddress}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Port</span>
                <span className="text-sm">{router.apiPort || '8728'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SSH Port</span>
                <span className="text-sm">{router.sshPort || '22'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SSTP Tunnel</span>
                <Badge variant={details.sstp?.connected ? "success" : "outline"}>
                  {details.sstp?.connected ? "Connected" : "Not Configured"}
                </Badge>
              </div>
              
              {details.sstp?.connected && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">VPN Address</span>
                    <span className="text-sm">{details.sstp?.vpnAddress || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Connected</span>
                    <span className="text-sm">
                      {details.sstp?.lastConnected 
                        ? new Date(details.sstp.lastConnected).toLocaleString() 
                        : 'N/A'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="model" className="mt-6">
        <TabsList>
          <TabsTrigger value="model">Model & Diagram</TabsTrigger>
          <TabsTrigger value="interfaces">Network Interfaces</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="model" className="mt-2">
          <RouterModelViewer routerId={routerId} modelName={router.model} />
        </TabsContent>
        
        <TabsContent value="interfaces" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Network Interfaces</CardTitle>
              <CardDescription>List of physical and virtual interfaces on this router</CardDescription>
            </CardHeader>
            <CardContent>
              {details.interfaces && details.interfaces.length > 0 ? (
                <div className="space-y-4">
                  {details.interfaces.map((iface, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Wifi className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="font-medium">{iface.name}</h3>
                        </div>
                        <Badge variant={iface.running ? "success" : "outline"}>
                          {iface.running ? "Up" : "Down"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p>{iface.type || 'Unknown'}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">MAC Address</p>
                          <p>{iface.macAddress || 'N/A'}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="text-muted-foreground">IP Addresses</p>
                          {iface.ipAddresses && iface.ipAddresses.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {iface.ipAddresses.map((ip, idx) => (
                                <Badge key={idx} variant="secondary">{ip}</Badge>
                              ))}
                            </div>
                          ) : (
                            <p>No IP addresses assigned</p>
                          )}
                        </div>
                        
                        {(iface.rxBytes !== undefined || iface.txBytes !== undefined) && (
                          <div className="col-span-2 grid grid-cols-2 gap-4">
                            {iface.rxBytes !== undefined && (
                              <div>
                                <p className="text-muted-foreground">Received</p>
                                <p>{formatBytes(iface.rxBytes)}</p>
                              </div>
                            )}
                            
                            {iface.txBytes !== undefined && (
                              <div>
                                <p className="text-muted-foreground">Transmitted</p>
                                <p>{formatBytes(iface.txBytes)}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <Server className="h-10 w-10 text-muted-foreground mb-2" />
                  <p>No interfaces data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tags" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Manage tags assigned to this router</CardDescription>
            </CardHeader>
            <CardContent>
              {details.tags && details.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {details.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <Tag className="h-10 w-10 text-muted-foreground mb-2" />
                  <p>No tags assigned to this router</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tags help you categorize and filter routers in your network
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>View and edit notes for this router</CardDescription>
            </CardHeader>
            <CardContent>
              {details.notes ? (
                <div className="border rounded-lg p-4 whitespace-pre-wrap">
                  {details.notes}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <p className="text-muted-foreground">No notes available for this router</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Utility function to format bytes to human-readable format
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}