import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Terminal, Network } from "lucide-react";

export function StorageCard() {
  const { data: storageStats, isLoading } = useQuery({
    queryKey: ['/api/stats/storage'],
    staleTime: 3600000 // 1 hour
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-pulse h-40 w-40 bg-gray-200 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Convert bytes to GB for display
  const backupsGB = storageStats ? (storageStats.backupsSize / 1000000000).toFixed(2) : "0";
  const systemFilesGB = storageStats ? (storageStats.systemFilesSize / 1000000000).toFixed(2) : "0";
  const totalGB = storageStats ? (storageStats.totalSize / 1000000000).toFixed(2) : "0";
  
  // Calculate percentages for the donut chart
  const backupsPercent = storageStats ? (storageStats.backupsSize / storageStats.totalSize) * 100 : 0;
  const systemFilesPercent = storageStats ? (storageStats.systemFilesSize / storageStats.totalSize) * 100 : 0;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Storage Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="70" fill="#f5f5f5" />
            <circle cx="90" cy="90" r="50" fill="white" />
            
            {/* Blue segment (backups) */}
            <path 
              d={`M90,20 A70,70 0 ${backupsPercent > 50 ? 1 : 0},1 ${
                90 + 70 * Math.sin(2 * Math.PI * (backupsPercent / 100))
              },${
                90 - 70 * Math.cos(2 * Math.PI * (backupsPercent / 100))
              }`} 
              fill="#2196f3" 
            />
            
            {/* Pink segment (system files) */}
            <path 
              d={`M90,20 A70,70 0 0,0 ${
                90 + 70 * Math.sin(2 * Math.PI * (systemFilesPercent / 100))
              },${
                90 - 70 * Math.cos(2 * Math.PI * (systemFilesPercent / 100))
              }`} 
              fill="#f48fb1" 
            />
            
            <text x="90" y="85" textAnchor="middle" fontSize="16" fontWeight="bold">
              {totalGB}GB
            </text>
            <text x="90" y="105" textAnchor="middle" fontSize="10" fill="#666">
              Total Usage
            </text>
          </svg>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
              <span className="text-sm">MikroTik Backups</span>
            </div>
            <span className="text-sm font-medium">{backupsGB}GB</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-pink-400 rounded-full mr-2"></span>
              <span className="text-sm">System Files</span>
            </div>
            <span className="text-sm font-medium">{systemFilesGB}GB</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg p-4 flex flex-col items-start">
        <ul className="space-y-2 w-full">
          {storageStats?.availableFeatures.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              {feature === 'WinBox' ? (
                <Box className="h-4 w-4 mr-2 text-primary-500" />
              ) : feature === 'WebSSH' ? (
                <Terminal className="h-4 w-4 mr-2 text-primary-500" />
              ) : (
                <Network className="h-4 w-4 mr-2 text-primary-500" />
              )}
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}
