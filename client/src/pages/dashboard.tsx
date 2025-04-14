import { TransferCard } from "@/components/dashboard/transfer-card";
import { RouterOverviewCard } from "@/components/dashboard/router-overview-card";
import { AlertsCard } from "@/components/dashboard/alerts-card";
import { MapCard } from "@/components/dashboard/map-card";
import { RouterHealthCard } from "@/components/dashboard/router-health-card";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("day");
  
  useEffect(() => {
    document.title = "Dashboard | ICTECH";
  }, []);
  
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">ICTECH Management Dashboard</h1>
        <p className="text-gray-500">Theo dõi toàn bộ mạng Mikrotik của bạn trong một bảng điều khiển</p>
      </div>
      
      {/* Top Row - Router Status, Alerts, Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RouterOverviewCard />
        <AlertsCard />
        <MapCard />
      </div>
      
      {/* Middle Row - Traffic Monitoring */}
      <div className="mb-6">
        <Tabs defaultValue="day" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">ROUTER HEALTH OVERVIEW</h2>
            <TabsList>
              <TabsTrigger value="day">DAY</TabsTrigger>
              <TabsTrigger value="week">WEEK</TabsTrigger>
              <TabsTrigger value="month">MONTH</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="day" className="m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransferCard />
              <RouterHealthCard />
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransferCard />
              <RouterHealthCard />
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransferCard />
              <RouterHealthCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bottom Section - Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Thêm bộ định tuyến</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Sao lưu tất cả</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Lệnh hàng loạt</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Cập nhật firmware</span>
          </div>
        </div>
      </div>
    </div>
  );
}
