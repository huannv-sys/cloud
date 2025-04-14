import { StorageCard } from "@/components/dashboard/storage-card";
import { TransferCard } from "@/components/dashboard/transfer-card";
import { FeaturesCard } from "@/components/dashboard/features-card";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | ICTECH";
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StorageCard />
        <TransferCard />
        <FeaturesCard />
      </div>
      
      {/* Additional dashboard widgets can be added here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="m9 14 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Backup completed</h3>
                <p className="text-sm text-gray-600">Automatic backup completed for all routers</p>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-warning-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-warning-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Home WiFi Main is offline</h3>
                <p className="text-sm text-gray-600">Router has been offline for 3 hours</p>
                <span className="text-xs text-gray-500">3 hours ago</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-success-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-success-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Security scan completed</h3>
                <p className="text-sm text-gray-600">No vulnerabilities found on 12 routers</p>
                <span className="text-xs text-gray-500">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
