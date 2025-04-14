import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Router } from "@shared/schema";
import { RefreshCcw } from "lucide-react";

interface RouterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function RouterTabs({ activeTab, onTabChange }: RouterTabsProps) {
  return (
    <div className="bg-primary-500 text-white rounded-t-lg">
      <div className="flex items-center px-4 py-3">
        <svg 
          className="h-5 w-5 mr-2" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M11 5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
          <path d="M19 3v10" />
          <path d="M14 8h10" />
        </svg>
        <h2 className="font-semibold">ROUTERS</h2>
        <button className="ml-auto text-white bg-primary-600 hover:bg-primary-700 rounded px-2 py-1 text-sm flex items-center">
          <RefreshCcw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full bg-transparent flex border-b border-primary-400 rounded-none p-0">
          <TabItem value="routers" activeTab={activeTab}>ROUTERS</TabItem>
          <TabItem value="backups" activeTab={activeTab}>BACKUPS</TabItem>
          <TabItem value="firmware" activeTab={activeTab}>FIRMWARE</TabItem>
          <TabItem value="fleet" activeTab={activeTab}>FLEET COMMANDER</TabItem>
          <TabItem value="security" activeTab={activeTab}>SECURITY</TabItem>
          <TabItem value="login" activeTab={activeTab}>LOGIN MANAGER</TabItem>
        </TabsList>
      </Tabs>
    </div>
  );
}

interface TabItemProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}

function TabItem({ value, activeTab, children }: TabItemProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "px-4 py-2 data-[state=active]:rounded-t-lg data-[state=active]:shadow-none",
        activeTab === value 
          ? "bg-white text-primary-600 font-medium" 
          : "text-white hover:bg-primary-400"
      )}
    >
      {children}
    </TabsTrigger>
  );
}
