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
  
  // Chart calculations for full circle donut
  const chartWidth = 120;
  const chartHeight = 120;
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const radius = 40;
  const strokeWidth = 20;
  
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
        {/* Full circle donut chart */}
        <div className="relative w-32">
          <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Background circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="transparent"
              stroke="#e5e5e5"
              strokeWidth={strokeWidth}
            />
            
            {/* Calculate the dash offsets for each segment */}
            {(() => {
              // We need to calculate the circumference of the circle
              const circumference = 2 * Math.PI * radius;
              
              // Calculate the dash array and offset for each segment
              const onlineLength = (onlinePercent / 100) * circumference;
              const permissionLength = (permissionPercent / 100) * circumference;
              const offlineLength = (offlinePercent / 100) * circumference;
              
              // Calculate starting positions
              const permissionOffset = onlineLength;
              const offlineOffset = onlineLength + permissionLength;
              
              return (
                <>
                  {/* Online segment (green) */}
                  {filters.online && onlinePercent > 0 && (
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={radius}
                      fill="transparent"
                      stroke="#4CAF50"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - onlineLength}
                      transform={`rotate(-90, ${centerX}, ${centerY})`}
                      className="cursor-pointer"
                      onClick={() => navigateToFilteredList('online')}
                    />
                  )}
                  
                  {/* Permission issue segment (orange) */}
                  {filters.permission && permissionPercent > 0 && (
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={radius}
                      fill="transparent"
                      stroke="#FF9800"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${permissionLength} ${circumference - permissionLength}`}
                      strokeDashoffset={`${circumference - permissionOffset}`}
                      transform={`rotate(-90, ${centerX}, ${centerY})`}
                      className="cursor-pointer"
                      onClick={() => navigateToFilteredList('permission')}
                    />
                  )}
                  
                  {/* Offline segment (red) */}
                  {filters.offline && offlinePercent > 0 && (
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={radius}
                      fill="transparent"
                      stroke="#F44336"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${offlineLength} ${circumference - offlineLength}`}
                      strokeDashoffset={`${circumference - offlineOffset}`}
                      transform={`rotate(-90, ${centerX}, ${centerY})`}
                      className="cursor-pointer"
                      onClick={() => navigateToFilteredList('offline')}
                    />
                  )}
                </>
              );
            })()}
            
            {/* Inner white circle for donut effect */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius - strokeWidth / 2}
              fill="white"
            />
            
            {/* Display the total count in the middle */}
            <text 
              x={centerX} 
              y={centerY} 
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