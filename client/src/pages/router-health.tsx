import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Cpu, Database, HardDrive, RefreshCw, Thermometer, Zap } from "lucide-react";
import { RouterStatus, RouterHealthStatus } from "@shared/types";
import { useToast } from "@/hooks/use-toast";

export default function RouterHealth() {
  const [selectedRouter, setSelectedRouter] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("24h");
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Router Health | Admiral";
  }, []);
  
  const { data: routers, isLoading: routersLoading } = useQuery({
    queryKey: ['/api/routers'],
    staleTime: 30000
  });
  
  // This would normally fetch health data for the selected router
  const { data: healthData, isLoading: healthLoading, refetch } = useQuery({
    queryKey: ['/api/routers', selectedRouter, 'health', timeRange],
    enabled: !!selectedRouter,
    staleTime: 60000
  });
  
  const handleRefresh = () => {
    if (selectedRouter) {
      refetch();
      toast({
        title: "Refreshing health data",
        description: "The latest health data is being fetched.",
      });
    } else {
      toast({
        title: "No router selected",
        description: "Please select a router to view health data.",
        variant: "destructive"
      });
    }
  };
  
  // Function to format uptime from seconds
  const formatUptime = (seconds?: number) => {
    if (!seconds) return "N/A";
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  // Dummy data for health history chart
  const cpuHistory = [5, 8, 12, 7, 3, 9, 15, 10, 8, 5, 3, 6, 4, 7, 9, 12, 10, 8, 7, 5, 3, 2, 4, 6];
  const memoryHistory = [25, 28, 30, 32, 35, 38, 40, 38, 35, 32, 30, 32, 35, 38, 42, 45, 42, 38, 35, 32, 30, 28, 25, 27];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Router Health</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={!selectedRouter}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Select Router</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedRouter}
                onValueChange={setSelectedRouter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a router" />
                </SelectTrigger>
                <SelectContent>
                  {routersLoading ? (
                    <SelectItem value="loading" disabled>Loading routers...</SelectItem>
                  ) : (
                    routers?.map((router: any) => (
                      <SelectItem key={router.id} value={router.id.toString()}>
                        {router.name} {router.online ? "(Online)" : "(Offline)"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Range</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={timeRange} onValueChange={setTimeRange}>
                <TabsList className="w-full">
                  <TabsTrigger value="1h">1h</TabsTrigger>
                  <TabsTrigger value="6h">6h</TabsTrigger>
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="7d">7d</TabsTrigger>
                  <TabsTrigger value="30d">30d</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {selectedRouter ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Cpu className="h-4 w-4 mr-1 text-primary-500" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthLoading ? (
                  <div className="h-12 animate-pulse bg-gray-200 rounded-md"></div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{healthData?.cpuLoad?.[0] || "5"}%</div>
                    <ProgressBar
                      value={healthData?.cpuLoad?.[0] || 5}
                      variant={healthData?.cpuLoad?.[0] > 80 ? "danger" : healthData?.cpuLoad?.[0] > 50 ? "warning" : "success"}
                      className="mt-2"
                    />
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Database className="h-4 w-4 mr-1 text-primary-500" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthLoading ? (
                  <div className="h-12 animate-pulse bg-gray-200 rounded-md"></div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{healthData?.memoryUsage || "32"}%</div>
                    <ProgressBar
                      value={healthData?.memoryUsage || 32}
                      variant={healthData?.memoryUsage > 80 ? "danger" : healthData?.memoryUsage > 50 ? "warning" : "success"}
                      className="mt-2"
                    />
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <HardDrive className="h-4 w-4 mr-1 text-primary-500" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthLoading ? (
                  <div className="h-12 animate-pulse bg-gray-200 rounded-md"></div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{healthData?.diskUsage || "75"}%</div>
                    <ProgressBar
                      value={healthData?.diskUsage || 75}
                      variant={healthData?.diskUsage > 90 ? "danger" : healthData?.diskUsage > 75 ? "warning" : "success"}
                      className="mt-2"
                    />
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-primary-500" />
                  Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthLoading ? (
                  <div className="h-12 animate-pulse bg-gray-200 rounded-md"></div>
                ) : (
                  <div className="text-xl font-bold">{formatUptime(healthData?.uptimeSeconds || 1209600)}</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>CPU Load History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 relative">
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 24 100">
                      <g>
                        <line x1="0" y1="0" x2="24" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="25" x2="24" y2="25" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="50" x2="24" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="75" x2="24" y2="75" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="100" x2="24" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                        
                        {/* Y-axis labels */}
                        <text x="-0.5" y="100" fontSize="8" textAnchor="end" dominantBaseline="middle">0%</text>
                        <text x="-0.5" y="75" fontSize="8" textAnchor="end" dominantBaseline="middle">25%</text>
                        <text x="-0.5" y="50" fontSize="8" textAnchor="end" dominantBaseline="middle">50%</text>
                        <text x="-0.5" y="25" fontSize="8" textAnchor="end" dominantBaseline="middle">75%</text>
                        <text x="-0.5" y="0" fontSize="8" textAnchor="end" dominantBaseline="middle">100%</text>
                      </g>
                      
                      {/* CPU Load Line */}
                      <polyline
                        points={cpuHistory.map((value, i) => `${i}, ${100 - value}`).join(' ')}
                        fill="none"
                        stroke="#2196f3"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 relative">
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 24 100">
                      <g>
                        <line x1="0" y1="0" x2="24" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="25" x2="24" y2="25" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="50" x2="24" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="75" x2="24" y2="75" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="100" x2="24" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                        
                        {/* Y-axis labels */}
                        <text x="-0.5" y="100" fontSize="8" textAnchor="end" dominantBaseline="middle">0%</text>
                        <text x="-0.5" y="75" fontSize="8" textAnchor="end" dominantBaseline="middle">25%</text>
                        <text x="-0.5" y="50" fontSize="8" textAnchor="end" dominantBaseline="middle">50%</text>
                        <text x="-0.5" y="25" fontSize="8" textAnchor="end" dominantBaseline="middle">75%</text>
                        <text x="-0.5" y="0" fontSize="8" textAnchor="end" dominantBaseline="middle">100%</text>
                      </g>
                      
                      {/* Memory Usage Line */}
                      <polyline
                        points={memoryHistory.map((value, i) => `${i}, ${100 - value}`).join(' ')}
                        fill="none"
                        stroke="#f44336"
                        strokeWidth="2"
                      />
                      
                      {/* Area under the line */}
                      <path
                        d={`M0,100 ${memoryHistory.map((value, i) => `L${i},${100 - value}`).join(' ')} L24,100 Z`}
                        fill="#f44336"
                        opacity="0.1"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Device Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Model:</span>
                        <span className="text-sm font-medium">CRS326-24G-2S+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Serial Number:</span>
                        <span className="text-sm font-medium">A12B34CD5E6F</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Firmware Version:</span>
                        <span className="text-sm font-medium">6.49.13</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">RouterBoard:</span>
                        <span className="text-sm font-medium">Yes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">License Level:</span>
                        <span className="text-sm font-medium">5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <Thermometer className="h-4 w-4 mr-1 text-primary-500" />
                          Temperature:
                        </span>
                        <span className="text-sm font-medium">42°C</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-primary-500" />
                          Voltage:
                        </span>
                        <span className="text-sm font-medium">12.1V</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">CPU Frequency:</span>
                        <span className="text-sm font-medium">650 MHz</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Memory:</span>
                        <span className="text-sm font-medium">128 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Free Memory:</span>
                        <span className="text-sm font-medium">87 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="mt-4">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary-50 p-3 mb-4">
              <HardDrive className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Router Selected</h3>
            <p className="text-gray-500 text-center max-w-md">
              Please select a router from the dropdown above to view detailed health information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
