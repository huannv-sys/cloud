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
  
  // Half-donut chart calculations
  const chartWidth = 120; // SVG width
  const chartHeight = 120; // SVG height
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const radius = 40;
  const strokeWidth = 20;
  const innerRadius = radius - strokeWidth / 2;

  // Calculate the angles for each segment
  const calculateSegments = () => {
    // The total degrees in the half-circle is 180 (not 360 for a full circle)
    const totalDegrees = 180;
    
    // Calculate the total visible routers
    const totalVisible = 
      (filters.online ? routerStats.online : 0) + 
      (filters.permission ? routerStats.permission : 0) + 
      (filters.offline ? routerStats.offline : 0);
    
    // Calculate the angle each segment should occupy
    const onlineAngle = filters.online ? (routerStats.online / totalRouters) * totalDegrees : 0;
    const permissionAngle = filters.permission ? (routerStats.permission / totalRouters) * totalDegrees : 0;
    const offlineAngle = filters.offline ? (routerStats.offline / totalRouters) * totalDegrees : 0;
    
    // Calculate the starting and ending angles for each segment
    return {
      online: {
        startAngle: 0,
        endAngle: onlineAngle
      },
      permission: {
        startAngle: onlineAngle,
        endAngle: onlineAngle + permissionAngle
      },
      offline: {
        startAngle: onlineAngle + permissionAngle,
        endAngle: onlineAngle + permissionAngle + offlineAngle
      }
    };
  };
  
  // Convert angle to coordinates
  const polarToCartesian = (angle: number) => {
    // Convert angle from degrees to radians
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians)
    };
  };
  
  // Generate SVG path for an arc
  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    
    // Determine if the arc is more than 180 degrees
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    // SVG path format for an arc
    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
    ].join(" ");
  };
  
  const segments = calculateSegments();
  
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
        {/* D-shaped Donut Chart */}
        <div className="relative w-32">
          <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Background line for the half-circle */}
            <path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
              fill="none"
              stroke="#e5e5e5"
              strokeWidth={strokeWidth}
            />
            
            {/* Online segment (green) */}
            {filters.online && onlinePercent > 0 && (
              <path
                d={createArc(0, segments.online.endAngle)}
                fill="none"
                stroke="#4CAF50"
                strokeWidth={strokeWidth}
                className="cursor-pointer"
                onClick={() => navigateToFilteredList('online')}
              />
            )}
            
            {/* Permission issue segment (orange) */}
            {filters.permission && permissionPercent > 0 && (
              <path
                d={createArc(segments.permission.startAngle, segments.permission.endAngle)}
                fill="none"
                stroke="#FF9800"
                strokeWidth={strokeWidth}
                className="cursor-pointer"
                onClick={() => navigateToFilteredList('permission')}
              />
            )}
            
            {/* Offline segment (red) */}
            {filters.offline && offlinePercent > 0 && (
              <path
                d={createArc(segments.offline.startAngle, segments.offline.endAngle)}
                fill="none"
                stroke="#F44336"
                strokeWidth={strokeWidth}
                className="cursor-pointer"
                onClick={() => navigateToFilteredList('offline')}
              />
            )}
            
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