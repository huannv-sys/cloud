import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";

export function RouterOverviewCard() {
  const { data: routers } = useQuery({
    queryKey: ['/api/routers'],
    staleTime: 60000 // 1 minute
  });
  
  const [location, setLocation] = useLocation();
  
  // For demo purposes, hardcoded values to match the screenshot
  const routerStats = {
    total: 51,
    online: 39,
    permission: 4,
    offline: 8
  };
  
  // Filter visibility state
  const [filters, setFilters] = useState({
    online: true,
    permission: true,
    offline: true
  });
  
  // Toggle a filter
  const toggleFilter = (filter: 'online' | 'permission' | 'offline') => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  // Navigate to filtered router list
  const navigateToFilteredList = (filter: 'online' | 'permission' | 'offline') => {
    // Navigate to router list with filter
    setLocation(`/routers?status=${filter}`);
  };
  
  // Compute the percentage for the donut chart segments
  const totalRouters = routerStats.total;
  const onlinePercent = filters.online ? (routerStats.online / totalRouters) * 100 : 0;
  const permissionPercent = filters.permission ? (routerStats.permission / totalRouters) * 100 : 0;
  const offlinePercent = filters.offline ? (routerStats.offline / totalRouters) * 100 : 0;
  
  // SVG path calculation for donut chart
  const radius = 50;
  const center = 60;
  const strokeWidth = 30;
  
  // Helper to calculate angles
  const calculateSegmentAngles = () => {
    const totalShown = 
      (filters.online ? routerStats.online : 0) + 
      (filters.permission ? routerStats.permission : 0) + 
      (filters.offline ? routerStats.offline : 0);
    
    const onlineAngle = filters.online ? (routerStats.online / totalShown) * 360 : 0;
    const permissionAngle = filters.permission ? (routerStats.permission / totalShown) * 360 : 0;
    const offlineAngle = filters.offline ? (routerStats.offline / totalShown) * 360 : 0;
    
    return {
      online: { start: 0, end: onlineAngle },
      permission: { start: onlineAngle, end: onlineAngle + permissionAngle },
      offline: { start: onlineAngle + permissionAngle, end: 360 }
    };
  };
  
  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>ROUTERS: {routerStats.total}</CardTitle>
          <div 
            className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium cursor-help"
            title="Vòng trạng thái cung cấp số lượng tất cả các bộ định tuyến và chia chúng thành trực tuyến, ngoại tuyến và những bộ định tuyến có vấn đề về quyền. Nhấp vào hộp màu để ẩn các bộ định tuyến đó khỏi biểu đồ. Nhấp vào phần màu của biểu đồ vòng sẽ đưa bạn đến chế độ xem được lọc của danh sách bộ định tuyến của bạn."
          >
            i
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Online segment (green) */}
            <circle 
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#4CAF50"
              strokeWidth={strokeWidth}
              strokeDasharray={`${onlinePercent * 3.14159 * radius / 100} ${2 * 3.14159 * radius}`}
              strokeDashoffset="0"
              transform="rotate(-90, 60, 60)"
              className="cursor-pointer"
              onClick={() => navigateToFilteredList('online')}
            />
            
            {/* Permission issue segment (orange) */}
            <circle 
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#FF9800"
              strokeWidth={strokeWidth}
              strokeDasharray={`${permissionPercent * 3.14159 * radius / 100} ${2 * 3.14159 * radius}`}
              strokeDashoffset={`${-onlinePercent * 3.14159 * radius / 100}`}
              transform="rotate(-90, 60, 60)"
              className="cursor-pointer"
              onClick={() => navigateToFilteredList('permission')}
            />
            
            {/* Offline segment (red) */}
            <circle 
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#F44336"
              strokeWidth={strokeWidth}
              strokeDasharray={`${offlinePercent * 3.14159 * radius / 100} ${2 * 3.14159 * radius}`}
              strokeDashoffset={`${-(onlinePercent + permissionPercent) * 3.14159 * radius / 100}`}
              transform="rotate(-90, 60, 60)"
              className="cursor-pointer"
              onClick={() => navigateToFilteredList('offline')}
            />
            
            {/* Inner white circle for donut effect */}
            <circle
              cx={center}
              cy={center}
              r={radius - strokeWidth / 2}
              fill="white"
            />
            
            {/* Display the total count in the middle */}
            <text 
              x={center} 
              y={center} 
              fontFamily="Arial" 
              fontSize="20" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontWeight="bold"
            >
              {totalRouters}
            </text>
          </svg>
        </div>
        
        {/* Legend with clickable boxes */}
        <div className="space-y-2">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => toggleFilter('online')}
          >
            <div className={`w-6 h-3 mr-2 ${filters.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">{routerStats.online} Online</span>
          </div>
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => toggleFilter('permission')}
          >
            <div className={`w-6 h-3 mr-2 ${filters.permission ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">{routerStats.permission} Permission Issue</span>
          </div>
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => toggleFilter('offline')}
          >
            <div className={`w-6 h-3 mr-2 ${filters.offline ? 'bg-red-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">{routerStats.offline} Offline</span>
          </div>
        </div>
      </CardContent>
      
      {/* Tooltip explaining the router status ring (hidden by default, shown on hover) */}
      <div className="absolute -top-10 left-0 right-0 bg-gray-800 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-90 transition-opacity duration-200 pointer-events-none z-10">
        Nhấp vào hộp màu để ẩn/hiện; nhấp vào biểu đồ để xem danh sách đã lọc
      </div>
    </Card>
  );
}