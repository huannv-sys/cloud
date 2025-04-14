import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, BarChart2, Activity, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export function AlertsCard() {
  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
    staleTime: 60000 // 1 minute - auto-update every minute as per requirements
  });
  
  const [location, setLocation] = useLocation();
  
  // Dummy data to match the screenshot
  const alertItems = [
    {
      id: 1,
      routerId: 12,
      routerName: "R5F12-FNPO1",
      message: "ether5 RX-CRC-ERROR changed from 2 to 3",
      timestamp: "Jul 4th 2024, 10:39:45 am",
      severity: "info"
    },
    {
      id: 2,
      routerId: 12,
      routerName: "R5F12-FNPO1",
      message: "ether5 RX-CRC-ERROR changed from 1 to 2",
      timestamp: "Jul 3rd 2024, 2:45:46 am",
      severity: "info"
    },
    {
      id: 3,
      routerId: 15,
      routerName: "LAN-ON",
      message: "STATUS changed from LINK-OK to NO-LINK",
      timestamp: "Apr 18th 2024, 8:41:13 am",
      severity: "warning"
    },
    {
      id: 4,
      routerId: 23,
      routerName: "ether3",
      message: "RUNNING changed from TRUE to FALSE",
      timestamp: "Jul 8th 2024, 8:09:14 am",
      severity: "error"
    },
    {
      id: 5,
      routerId: 23,
      routerName: "ether3",
      message: "RUNNING changed from FALSE to TRUE",
      timestamp: "Jul 8th 2024, 11:56:47 am",
      severity: "success"
    }
  ];

  // Get icon and colors based on severity
  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'error':
        return { color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-500' };
      case 'warning':
        return { color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500' };
      case 'success':
        return { color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-500' };
      default:
        return { color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-500' };
    }
  };
  
  // View router timeline
  const viewRouterTimeline = (routerId: number) => {
    setLocation(`/routers/${routerId}/timeline`);
  };
  
  // View router health
  const viewRouterHealth = (routerId: number) => {
    setLocation(`/routers/${routerId}/health`);
  };
  
  // Mark notification as read/dismissed
  const dismissNotification = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Would normally use invalidateQueries here to refresh data
      // But we're using dummy data for now
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }
  };
  
  // View all alerts
  const viewAllAlerts = () => {
    setLocation('/alerts');
  };
  
  // This effect would simulate auto-refresh every minute in a real app
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would trigger a refetch of notifications
      // queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }, 60000); // every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              ⚠️ ALERTS
            </span>
          </div>
          <div 
            className="flex items-center text-blue-500 text-sm font-medium cursor-pointer"
            onClick={viewAllAlerts}
            title="Nhấp để xem trang cảnh báo với bộ lọc và tìm kiếm nâng cao"
          >
            ALERTS VIEW
            <ExternalLink className="h-4 w-4 ml-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 max-h-[300px] overflow-y-auto px-0">
        {alertItems.map((alert) => {
          const { color, bgColor, borderColor } = getSeverityStyles(alert.severity);
          return (
            <div 
              key={alert.id} 
              className={`px-4 py-2 border-l-4 ${borderColor} ${bgColor} hover:bg-gray-50 transition-colors duration-150`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block rounded-full w-2 h-2 ${color}`}></span>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => viewRouterTimeline(alert.routerId)}
                    className="p-1 rounded-full hover:bg-gray-200"
                    title="Xem dòng thời gian của bộ định tuyến"
                  >
                    <BarChart2 className="h-4 w-4 text-blue-500" />
                  </button>
                  
                  <button 
                    onClick={() => viewRouterHealth(alert.routerId)}
                    className="p-1 rounded-full hover:bg-gray-200"
                    title="Xem tình trạng sức khỏe bộ định tuyến"
                  >
                    <Activity className="h-4 w-4 text-green-500" />
                  </button>
                  
                  <button 
                    onClick={() => dismissNotification(alert.id)}
                    className="p-1 rounded-full hover:bg-gray-200"
                    title="Bỏ qua thông báo"
                  >
                    <XCircle className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
      
      {/* Tooltip explaining the alerts (hidden by default, shown on hover) */}
      <div className="absolute -top-10 left-0 right-0 bg-gray-800 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-90 transition-opacity duration-200 pointer-events-none z-10">
        Cảnh báo tự động cập nhật mỗi phút. Sử dụng các nút bên phải để tương tác với thông báo.
      </div>
    </Card>
  );
}