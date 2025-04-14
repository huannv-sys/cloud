import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Subscriber } from "@shared/schema";
import { useState } from "react";
import { Send, RotateCw, X, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SubscriberManagementProps {
  routerId: number;
  displayBandwidthLimits: boolean;
  billingId?: string;
}

export function SubscriberManagement({ 
  routerId, 
  displayBandwidthLimits,
  billingId 
}: SubscriberManagementProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: subscribers, isLoading } = useQuery({
    queryKey: [`/api/subscribers?routerId=${routerId}`],
    staleTime: 60000 // 1 minute
  });
  
  const addSubscriberMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/subscribers", {
        email,
        active: true,
        routerId
      });
    },
    onSuccess: () => {
      setEmail("");
      queryClient.invalidateQueries({ queryKey: [`/api/subscribers?routerId=${routerId}`] });
      toast({
        title: "Subscriber added",
        description: "The subscriber has been added successfully.",
        variant: "success"
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding subscriber",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const updateSubscriberMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number, active: boolean }) => {
      await apiRequest("PATCH", `/api/subscribers/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/subscribers?routerId=${routerId}`] });
      toast({
        title: "Subscriber updated",
        description: "The subscriber status has been updated.",
        variant: "success"
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating subscriber",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const removeSubscriberMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/subscribers/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/subscribers?routerId=${routerId}`] });
      toast({
        title: "Subscriber removed",
        description: "The subscriber has been removed successfully.",
        variant: "success"
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing subscriber",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addSubscriberMutation.mutate(email);
    }
  };
  
  const toggleSubscriberActive = (subscriber: Subscriber) => {
    updateSubscriberMutation.mutate({
      id: subscriber.id,
      active: !subscriber.active
    });
  };
  
  const handleRemoveSubscriber = (id: number) => {
    removeSubscriberMutation.mutate(id);
  };
  
  return (
    <div>
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">SUBSCRIBERS</h2>
        
        <div className="mt-4">
          <form onSubmit={handleAddSubscriber} className="flex items-end space-x-2">
            <div className="flex-1">
              <Label htmlFor="subscriber-email">Invite a User:</Label>
              <Input
                id="subscriber-email"
                type="email"
                placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-success-500 hover:bg-success-600 text-white"
              disabled={addSubscriberMutation.isPending}
            >
              <Send className="h-4 w-4 mr-1" /> Send Invite
            </Button>
            <Button type="button" variant="outline">
              Subscriber View
            </Button>
          </form>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 font-medium text-gray-600 mb-2 px-2">
          <div>Email</div>
          <div>Status</div>
          <div>Re-send Invite</div>
          <div>Remove</div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">Loading subscribers...</div>
        ) : subscribers?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No subscribers yet</div>
        ) : (
          subscribers?.map((subscriber: Subscriber) => (
            <div 
              key={subscriber.id} 
              className="grid grid-cols-4 gap-4 items-center py-2 border-t border-gray-100 px-2"
            >
              <div className="text-gray-700">{subscriber.email}</div>
              <div>
                <span className={`px-2 py-1 text-sm ${subscriber.active ? 'text-success-600' : 'text-gray-500'}`}>
                  {subscriber.active ? 'active' : 'inactive'}
                </span>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-500 hover:text-primary-600"
                  onClick={() => console.log("Re-send invite to", subscriber.email)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-danger-500 hover:text-danger-600"
                  onClick={() => handleRemoveSubscriber(subscriber.id)}
                  disabled={removeSubscriberMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-500 hover:text-primary-600"
                  onClick={() => toggleSubscriberActive(subscriber)}
                  disabled={updateSubscriberMutation.isPending}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 flex items-center">
        <Switch 
          id="bandwidth-limits"
          checked={displayBandwidthLimits}
          onCheckedChange={() => console.log("Toggle bandwidth limits")}
        />
        <Label htmlFor="bandwidth-limits" className="ml-2">Display Bandwidth Limits</Label>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <span className="font-medium mr-2">Billing ID:</span>
          <span className="text-gray-700">{billingId || "Not set."}</span>
        </div>
      </div>
    </div>
  );
}
