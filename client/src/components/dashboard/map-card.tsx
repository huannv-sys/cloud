import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

export function MapCard() {
  const { data: routers } = useQuery({
    queryKey: ['/api/routers'],
    staleTime: 60000 // 1 minute
  });
  
  const [location, setLocation] = useLocation();
  
  // View full map page
  const viewFullMap = () => {
    setLocation('/map');
  };
  
  // Simulate router locations on a map for demo purposes
  const dummyLocations = [
    { id: 1, lat: 37.7749, lng: -122.4194, name: "San Francisco Router", status: "online" }, // West US
    { id: 2, lat: 40.7128, lng: -74.0060, name: "New York Router", status: "online" },      // East US
    { id: 3, lat: 51.5074, lng: -0.1278, name: "London Router", status: "warning" },        // Europe
    { id: 4, lat: 35.6762, lng: 139.6503, name: "Tokyo Router", status: "offline" },        // Asia
  ];
  
  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>MAP</CardTitle>
          <div 
            className="flex items-center text-blue-500 text-sm font-medium cursor-pointer"
            onClick={viewFullMap}
            title="Nhấp để xem bản đồ lớn với thông tin chi tiết"
          >
            MAP VIEW
            <ExternalLink className="h-4 w-4 ml-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden h-64 relative">
        {/* World Map Background */}
        <div className="w-full h-full bg-blue-50 relative">
          {/* Simplified World Map (Vector Shape) */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            style={{ background: '#f0f8ff' }}
          >
            {/* North America */}
            <path
              d="M 200,150 L 150,180 L 120,220 L 150,250 L 200,270 L 250,300 L 270,270 L 300,240 L 320,200 L 280,170 L 250,160 Z"
              fill="#e5e5e5"
              stroke="#cccccc"
              strokeWidth="1"
            />
            
            {/* South America */}
            <path
              d="M 250,300 L 270,350 L 300,400 L 320,380 L 310,340 L 290,320 L 270,310 Z"
              fill="#e5e5e5"
              stroke="#cccccc"
              strokeWidth="1"
            />
            
            {/* Europe + Africa */}
            <path
              d="M 450,150 L 500,180 L 520,200 L 510,230 L 490,260 L 470,300 L 450,350 L 430,320 L 420,290 L 440,260 L 460,240 L 470,210 L 460,180 Z"
              fill="#e5e5e5"
              stroke="#cccccc"
              strokeWidth="1"
            />
            
            {/* Asia + Australia */}
            <path
              d="M 520,200 L 550,190 L 600,180 L 650,190 L 700,210 L 720,230 L 700,260 L 670,270 L 650,300 L 700,350 L 650,370 L 600,360 L 570,330 L 550,290 L 530,250 L 510,230 Z"
              fill="#e5e5e5"
              stroke="#cccccc"
              strokeWidth="1"
            />
            
            {/* Router markers */}
            {dummyLocations.map((router) => {
              // Scale lat/lng to our SVG coordinates (very simplified)
              const x = (router.lng + 180) * (1000 / 360);
              const y = (90 - router.lat) * (500 / 180);
              
              // Determine color based on status
              let color = "#4CAF50"; // online - green
              if (router.status === "warning") color = "#FF9800"; // warning - orange
              if (router.status === "offline") color = "#F44336"; // offline - red
              
              return (
                <g key={router.id} className="cursor-pointer" title={router.name}>
                  {/* Outer circle for emphasis */}
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill={color}
                    opacity="0.3"
                  />
                  
                  {/* Main router marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={color}
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  
                  {/* Router ID label */}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {router.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </CardContent>
      
      {/* Tooltip explaining the map (hidden by default, shown on hover) */}
      <div className="absolute -top-10 left-0 right-0 bg-gray-800 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-90 transition-opacity duration-200 pointer-events-none z-10">
        Bản đồ được tạo tự động từ dữ liệu địa chỉ. Nhấp vào điểm để xem thông tin chi tiết.
      </div>
    </Card>
  );
}