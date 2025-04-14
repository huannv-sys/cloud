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
        <CardTitle>Traffic</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-sm px-4 py-2 font-medium">DOWNLOAD</div>
        {/* Download Traffic Graph */}
        <div className="h-40 relative px-4">
          <div className="flex items-start justify-between text-xs text-gray-500 mb-1">
            <div>150</div>
            <div>100</div>
            <div>50</div>
            <div>0</div>
          </div>
          <div className="flex flex-col justify-between h-full border-b border-gray-200">
            {/* Grid lines */}
            <div className="grid grid-rows-3 h-full">
              <div className="border-t border-gray-200"></div>
              <div className="border-t border-gray-200"></div>
              <div className="border-t border-gray-200"></div>
            </div>
            
            {/* Time labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <div>2PM</div>
              <div>5PM</div>
              <div>9PM</div>
              <div>Jul 5</div>
              <div>4AM</div>
              <div>7AM</div>
              <div>11AM</div>
            </div>
          </div>
          
          {/* Download chart */}
          <div className="absolute left-4 right-4 top-4 bottom-6">
            {/* Multicolor line chart */}
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Yellow line */}
              <path 
                d="M0,60 L20,55 L40,59 L60,58 L80,60 L100,57 L120,56 L140,58 L160,59 L180,60 L200,60 L220,59 L240,58 L260,57 L280,58 L300,59 L320,60"
                stroke="#F9A825"
                strokeWidth="1.5"
                fill="none"
              />
              
              {/* Green line */}
              <path 
                d="M0,65 L20,64 L40,62 L60,61 L80,63 L100,64 L120,65 L140,63 L160,62 L180,64 L200,65 L220,63 L240,64 L260,65 L280,64 L300,63 L320,65"
                stroke="#66BB6A"
                strokeWidth="1.5"
                fill="none"
              />
              
              {/* Blue line */}
              <path 
                d="M0,50 L20,52 L40,48 L60,45 L80,47 L100,50 L120,48 L140,46 L160,49 L180,50 L200,48 L220,45 L240,47 L260,50 L280,48 L300,49 L320,50"
                stroke="#29B6F6"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>
        
        {/* Legend for download */}
        <div className="text-xs flex flex-wrap gap-2 mb-4 px-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-400 mr-1 rounded-sm"></span>
            <span>sfp-sfpplus4</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span>
            <span>sfp-sfpplus2</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-pink-300 mr-1 rounded-sm"></span>
            <span>ether8</span>
          </div>
          {/* Add more legend items as seen in the screenshot */}
        </div>
        
        <div className="text-sm px-4 py-2 font-medium">UPLOAD</div>
        {/* Upload Traffic Graph */}
        <div className="h-40 relative px-4">
          <div className="flex items-start justify-between text-xs text-gray-500 mb-1">
            <div>150</div>
            <div>100</div>
            <div>50</div>
            <div>0</div>
          </div>
          <div className="flex flex-col justify-between h-full border-b border-gray-200">
            {/* Grid lines */}
            <div className="grid grid-rows-3 h-full">
              <div className="border-t border-gray-200"></div>
              <div className="border-t border-gray-200"></div>
              <div className="border-t border-gray-200"></div>
            </div>
            
            {/* Time labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <div>2PM</div>
              <div>5PM</div>
              <div>9PM</div>
              <div>Jul 5</div>
              <div>4AM</div>
              <div>7AM</div>
              <div>11AM</div>
            </div>
          </div>
          
          {/* Upload chart */}
          <div className="absolute left-4 right-4 top-4 bottom-6">
            {/* Multicolor line chart */}
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Light blue line */}
              <path 
                d="M0,75 L20,73 L40,72 L60,73 L80,74 L100,75 L120,73 L140,72 L160,73 L180,74 L200,75 L220,74 L240,73 L260,72 L280,74 L300,75 L320,74"
                stroke="#29B6F6"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Additional upload lines could be added here */}
            </svg>
          </div>
        </div>
        
        {/* Legend for upload */}
        <div className="text-xs flex flex-wrap gap-2 mb-2 px-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-400 mr-1 rounded-sm"></span>
            <span>sfp-sfpplus4</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span>
            <span>sfp-sfpplus2</span>
          </div>
          {/* Add more legend items as seen in the screenshot */}
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
