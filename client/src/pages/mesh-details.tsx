import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info } from "lucide-react";
import { SubscriberManagement } from "@/components/subscribers/subscriber-management";
import { useToast } from "@/hooks/use-toast";

export default function MeshDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("subscribers");
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Mesh Details | Admiral";
  }, []);
  
  const { data: meshLab, isLoading, error } = useQuery({
    queryKey: [`/api/mesh-labs/${id}`],
    staleTime: 60000 // 1 minute
  });
  
  const { data: router } = useQuery({
    queryKey: [`/api/routers/${meshLab?.routerId}`],
    enabled: !!meshLab?.routerId,
    staleTime: 60000
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-gray-600">Loading mesh details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !meshLab) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-2 mb-4">
            <Info className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Mesh Lab</h2>
          <p className="text-gray-600 mb-4">Unable to load the mesh lab details. Please try again later.</p>
          <Link href="/routers">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Router List
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/routers">
          <Button variant="ghost" className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">{meshLab.name}</h1>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Router Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Router Name</h3>
                <p>{router?.name || 'Loading...'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Connection</h3>
                <p>{router?.connectionString || 'Loading...'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <div className="flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full mr-2 ${router?.online ? 'bg-success-500' : 'bg-danger-500'}`}></span>
                  <span>{router?.online ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="wireless">Wireless</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="webSSH">Web SSH</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>
        
        <div className="bg-white border border-gray-200 rounded-lg">
          <TabsContent value="subscribers" className="m-0">
            <SubscriberManagement 
              routerId={meshLab.routerId} 
              displayBandwidthLimits={meshLab.displayBandwidthLimits}
              billingId={meshLab.billingId}
            />
          </TabsContent>
          
          <TabsContent value="timeline" className="m-0 p-4">
            <div className="flex flex-col space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">Timeline</h2>
                <div className="border-l-2 border-gray-200 pl-4 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-primary-500"></div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Today, 10:30 AM</span>
                      <span className="font-medium">Router came online</span>
                      <span className="text-sm text-gray-600 mt-1">
                        The router was successfully connected to the network.
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-warning-500"></div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Yesterday, 2:15 PM</span>
                      <span className="font-medium">Firmware update available</span>
                      <span className="text-sm text-gray-600 mt-1">
                        A new firmware update (7.15) is available for this router.
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-success-500"></div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">April 12, 2025, 9:00 AM</span>
                      <span className="font-medium">Subscriber added</span>
                      <span className="text-sm text-gray-600 mt-1">
                        New subscriber candice+subscriber11@remotewinbox.com was added.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="m-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">30%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">30%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 relative">
                    {/* Placeholder for chart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Traffic data chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="wireless" className="m-0 p-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Wireless Networks</h2>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">MeshLab-Main</h3>
                      <p className="text-sm text-gray-500">2.4 GHz</p>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-success-500 mr-2"></span>
                      <span className="text-sm">Active</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">SSID</span>
                      <p>MeshLab-Main</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Frequency</span>
                      <p>2.4 GHz</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Channel</span>
                      <p>6</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Security</span>
                      <p>WPA2-PSK</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Connected Clients</span>
                      <p>3</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">TX/RX Rate</span>
                      <p>300/300 Mbps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">MeshLab-5G</h3>
                      <p className="text-sm text-gray-500">5 GHz</p>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-success-500 mr-2"></span>
                      <span className="text-sm">Active</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">SSID</span>
                      <p>MeshLab-5G</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Frequency</span>
                      <p>5 GHz</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Channel</span>
                      <p>44</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Security</span>
                      <p>WPA2-PSK</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Connected Clients</span>
                      <p>2</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">TX/RX Rate</span>
                      <p>867/867 Mbps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="backups" className="m-0 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Configuration Backups</h2>
              <Button>Create Backup</Button>
            </div>
            
            <div className="space-y-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto Backup</h3>
                      <p className="text-sm text-gray-500">April 14, 2025 - 08:00 AM</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Restore</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manual Backup</h3>
                      <p className="text-sm text-gray-500">April 13, 2025 - 06:30 PM</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Restore</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Pre-Firmware Update</h3>
                      <p className="text-sm text-gray-500">April 10, 2025 - 10:15 AM</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Restore</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="webSSH" className="m-0 p-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Web SSH Terminal</h2>
              <div className="bg-gray-900 text-gray-100 font-mono p-4 rounded-lg h-80 overflow-auto">
                <div className="mb-1">[admin@MeshLab1] &gt; /system resource print</div>
                <div className="mb-1">                   uptime: 14d15h28m44s</div>
                <div className="mb-1">                  version: 7.14.3 (stable)</div>
                <div className="mb-1">               build-time: Apr/10/2025 16:19:50</div>
                <div className="mb-1">              factory-software: 7.14.3</div>
                <div className="mb-1">               free-memory: 87.0MiB</div>
                <div className="mb-1">              total-memory: 128.0MiB</div>
                <div className="mb-1">                      cpu: ARMv7</div>
                <div className="mb-1">                cpu-count: 1</div>
                <div className="mb-1">            cpu-frequency: 650MHz</div>
                <div className="mb-1">                 cpu-load: 5%</div>
                <div className="mb-1">           free-hdd-space: 21.0MiB</div>
                <div className="mb-1">          total-hdd-space: 32.0MiB</div>
                <div className="mb-1">  write-sect-since-reboot: 2392</div>
                <div className="mb-1">         write-sect-total: 24859</div>
                <div className="mb-1">               bad-blocks: 0%</div>
                <div className="mb-1">         architecture-name: arm</div>
                <div className="mb-1">               board-name: RouterBOARD 952Ui-5ac2nD</div>
                <div className="mb-1">                 platform: MikroTik</div>
                <div className="mb-4">[admin@MeshLab1] &gt; </div>
                <div className="animate-pulse">_</div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Clear Terminal</Button>
                <Button variant="outline">Copy Output</Button>
                <Button>Open Full Terminal</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="extras" className="m-0 p-4">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">Remote Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">WinBox Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Connection URL:</span>
                        <div className="flex mt-1">
                          <input 
                            type="text" 
                            readOnly 
                            value="vpn1.remotewinbox.com:45673"
                            className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <Button className="rounded-l-none">Copy</Button>
                        </div>
                      </div>
                      <Button className="w-full mt-2">
                        Launch WinBox
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">WebFig Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Open RouterOS WebFig interface:</span>
                      </div>
                      <Button className="w-full">
                        Open WebFig
                      </Button>
                      <p className="text-xs text-gray-500 mt-3">
                        Note: WebFig access requires proper port forwarding and firewall configuration.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-3">Advanced Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-3 justify-start">
                    <div className="flex flex-col items-start">
                      <span>Reboot Device</span>
                      <span className="text-xs text-gray-500">Restart the router</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-3 justify-start">
                    <div className="flex flex-col items-start">
                      <span>Reset Configuration</span>
                      <span className="text-xs text-gray-500">Reset to defaults</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-3 justify-start">
                    <div className="flex flex-col items-start">
                      <span>Update Firmware</span>
                      <span className="text-xs text-gray-500">Install latest version</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
