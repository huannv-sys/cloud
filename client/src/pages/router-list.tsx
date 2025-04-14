import { useEffect, useState } from "react";
import { RouterTabs } from "@/components/router-tabs";
import { RouterActions } from "@/components/router-actions";
import { RouterList } from "@/components/router-list";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function RouterListPage() {
  const [activeTab, setActiveTab] = useState("routers");
  const [addRouterDialogOpen, setAddRouterDialogOpen] = useState(false);
  const [ezConfigDialogOpen, setEzConfigDialogOpen] = useState(false);
  const [routerForm, setRouterForm] = useState({
    name: "",
    model: "",
    ipAddress: "",
    connectionString: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    document.title = "Router List | Admiral";
  }, []);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleAddRouter = () => {
    setAddRouterDialogOpen(true);
  };
  
  const handleEzConfig = () => {
    setEzConfigDialogOpen(true);
  };
  
  const handleRediscover = () => {
    toast({
      title: "Rediscovering routers",
      description: "The system is scanning your network for MikroTik routers.",
    });
  };
  
  const handleGenerateCsv = () => {
    toast({
      title: "Generating CSV",
      description: "The router list CSV file is being generated.",
    });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRouterForm({
      ...routerForm,
      [e.target.name]: e.target.value
    });
  };
  
  const addRouterMutation = useMutation({
    mutationFn: async (routerData: any) => {
      return await apiRequest("POST", "/api/routers", routerData);
    },
    onSuccess: () => {
      setAddRouterDialogOpen(false);
      setRouterForm({
        name: "",
        model: "",
        ipAddress: "",
        connectionString: "",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/routers'] });
      toast({
        title: "Router added",
        description: "The router has been added successfully.",
        variant: "success"
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding router",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleSubmitRouter = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a connection string if none provided
    const connectionString = routerForm.connectionString || 
      `vpn1.remotewinbox.com:${Math.floor(10000 + Math.random() * 50000)}`;
    
    addRouterMutation.mutate({
      ...routerForm,
      connectionString,
      online: true,
      firmware: "7.1.5",
      cpuUsage: 1,
      ramUsage: 20,
      diskUsage: 30,
      tags: ["New"]
    });
  };
  
  return (
    <div>
      <RouterTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === "routers" && (
        <>
          <RouterActions 
            onAddRouter={handleAddRouter}
            onEzConfig={handleEzConfig}
            onRediscover={handleRediscover}
            onGenerateCsv={handleGenerateCsv}
            totalPages={1}
          />
          <RouterList />
        </>
      )}
      
      {activeTab === "backups" && (
        <div className="bg-white p-4 rounded-b-lg shadow">
          <h2 className="text-xl font-semibold">Backups</h2>
          <p className="text-gray-600 mt-2">Manage your router backups here.</p>
        </div>
      )}
      
      {activeTab === "firmware" && (
        <div className="bg-white p-4 rounded-b-lg shadow">
          <h2 className="text-xl font-semibold">Firmware Management</h2>
          <p className="text-gray-600 mt-2">Manage firmware updates for your routers.</p>
        </div>
      )}
      
      {activeTab === "fleet" && (
        <div className="bg-white p-4 rounded-b-lg shadow">
          <h2 className="text-xl font-semibold">Fleet Commander</h2>
          <p className="text-gray-600 mt-2">Send commands to multiple routers at once.</p>
        </div>
      )}
      
      {activeTab === "security" && (
        <div className="bg-white p-4 rounded-b-lg shadow">
          <h2 className="text-xl font-semibold">Security</h2>
          <p className="text-gray-600 mt-2">Manage security settings for your routers.</p>
        </div>
      )}
      
      {activeTab === "login" && (
        <div className="bg-white p-4 rounded-b-lg shadow">
          <h2 className="text-xl font-semibold">Login Manager</h2>
          <p className="text-gray-600 mt-2">Manage login credentials for your routers.</p>
        </div>
      )}
      
      {/* Add Router Dialog */}
      <Dialog open={addRouterDialogOpen} onOpenChange={setAddRouterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Router</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitRouter}>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Router Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Home Router"
                    value={routerForm.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g. hAP ac²"
                    value={routerForm.model}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input
                    id="ipAddress"
                    name="ipAddress"
                    placeholder="e.g. 192.168.1.1"
                    value={routerForm.ipAddress}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connectionString">Connection String (Optional)</Label>
                  <Input
                    id="connectionString"
                    name="connectionString"
                    placeholder="Will be auto-generated if empty"
                    value={routerForm.connectionString}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddRouterDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addRouterMutation.isPending}
                className="bg-primary-500 hover:bg-primary-600"
              >
                {addRouterMutation.isPending ? "Adding..." : "Add Router"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* EZ Config Dialog */}
      <Dialog open={ezConfigDialogOpen} onOpenChange={setEzConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>EZ Config</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              EZ Config allows you to quickly configure your MikroTik routers with recommended settings.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="router-list">Select Router</Label>
                <select
                  id="router-list"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a router...</option>
                  <option value="1">LAN CRS326</option>
                  <option value="2">WAN-CRS326</option>
                  <option value="3">Mesh Lab 1</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="config-type">Configuration Type</Label>
                <select
                  id="config-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="basic">Basic Configuration</option>
                  <option value="secure">Secure Configuration</option>
                  <option value="advanced">Advanced Configuration</option>
                </select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEzConfigDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              className="bg-primary-500 hover:bg-primary-600"
              onClick={() => {
                setEzConfigDialogOpen(false);
                toast({
                  title: "Configuration applied",
                  description: "The EZ Config has been applied to the selected router.",
                  variant: "success"
                });
              }}
            >
              Apply Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
