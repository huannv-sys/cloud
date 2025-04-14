import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function TransferCard() {
  const { data: transferStats, isLoading } = useQuery({
    queryKey: ['/api/stats/transfer'],
    staleTime: 300000 // 5 minutes
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-40 bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Convert bytes to GB for display
  const dailyTransferGB = transferStats 
    ? (transferStats.dailyTransfer / 1000000000).toFixed(2) 
    : "0";
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Transfer Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Traffic Graph */}
        <div className="h-40 relative bg-white">
          <div className="absolute inset-0 grid grid-cols-24 grid-rows-6">
            {/* Y-axis labels */}
            <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>50</span>
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute left-6 right-0 top-0 bottom-0">
              <div className="grid grid-rows-6 h-full">
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
              </div>
            </div>
            
            {/* Data area */}
            <div className="absolute left-6 right-0 top-0 bottom-0 pl-2">
              {/* Blue bar chart */}
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d="M0,120 L10,70 L20,30 L30,40 L40,80 L50,90 L60,70 L70,70 L80,100 L90,70 L100,40 L110,50 L120,90 L130,100 L140,70 L150,40 L160,50 L170,90 L180,100 L190,110 L200,120 L210,120 L220,120 L230,120 L240,120 L250,120 L260,120 L270,120 L280,120 L290,120 L300,120 L310,120 L320,120 L330,120 L340,120 L350,120 L360,120 L370,120 L380,120 L390,120 L400,120 L400,120 L0,120 Z"
                  fill="#2196f3" 
                  opacity="0.8"
                />
                <path 
                  d="M0,120 L10,100 L20,110 L30,100 L40,120 L50,110 L60,120 L70,100 L80,120 L90,110 L100,100 L110,120 L120,110 L130,120 L140,110 L150,100 L160,120 L170,110 L180,120 L190,120 L200,120 L210,120 L220,120 L230,120 L240,120 L250,120 L260,120 L270,120 L280,120 L290,120 L300,120 L310,120 L320,120 L330,120 L340,120 L350,120 L360,120 L370,120 L380,120 L390,120 L400,120 L400,120 L0,120 Z"
                  fill="#f48fb1" 
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-start space-x-4 text-xs">
          {transferStats?.devices.map((device, index) => (
            <div key={index} className="flex items-center">
              <span 
                className="w-3 h-3 rounded-sm mr-1" 
                style={{ backgroundColor: device.color }}
              />
              <span>{device.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg p-4">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Daily Transfer:</span>
            <span className="text-sm">{dailyTransferGB}GB</span>
          </div>
          {/* Small donut chart */}
          <div className="flex justify-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="#f5f5f5" />
              <circle cx="50" cy="50" r="25" fill="white" />
              
              {/* Blue segment (80%) */}
              <path 
                d="M50,10 A40,40 0 1,1 10,50" 
                fill="#2196f3" 
              />
              {/* Green segment (15%) */}
              <path 
                d="M50,10 A40,40 0 0,0 40,11" 
                fill="#4caf50" 
              />
              {/* Pink segment (5%) */}
              <path 
                d="M40,11 A40,40 0 0,0 10,50" 
                fill="#f48fb1" 
              />
              
              <text x="50" y="47" textAnchor="middle" fontSize="10" fontWeight="bold">
                {dailyTransferGB}GB
              </text>
              <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#666">
                Today
              </text>
            </svg>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
