import { Checkbox } from "@/components/ui/checkbox";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Terminal, Download, User, Edit, Trash2, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Link } from "wouter";
import { Router } from "@shared/schema";

export function RouterList() {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  
  const { data: routers, isLoading, error } = useQuery({
    queryKey: ['/api/routers'],
    staleTime: 30000
  });
  
  const handleSelectRow = (id: number, selected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (selected) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    
    setSelectedRows(newSelectedRows);
  };
  
  const handleRowClick = (router: Router) => {
    console.log("Row clicked", router);
  };
  
  const columns = [
    {
      header: (
        <div className="flex items-center">
          Name
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </div>
      ),
      accessorKey: (router: Router) => (
        <div className="flex items-center">
          <img 
            className="h-7 w-7"
            src={`https://via.placeholder.com/32x32?text=${router.name.charAt(0)}`}
            alt={router.name}
          />
          <div className="ml-2">
            <div className="font-medium text-gray-900">{router.name}</div>
            <div className="text-xs text-gray-500">{router.connectionString}</div>
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center">
          Online
          <Filter className="ml-1 h-3 w-3 text-primary-500" />
        </div>
      ),
      accessorKey: (router: Router) => (
        <StatusIndicator status={router.online ? "online" : "offline"} />
      )
    },
    {
      header: (
        <div className="flex items-center">
          Tags
          <Filter className="ml-1 h-3 w-3 text-primary-500" />
        </div>
      ),
      accessorKey: (router: Router) => (
        <div className="flex flex-wrap gap-1">
          {router.tags?.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-200">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center">
          Firmware
          <Filter className="ml-1 h-3 w-3" />
        </div>
      ),
      accessorKey: (router: Router) => (
        <div className="flex items-center">
          <span className="text-sm">{router.firmware}</span>
          {router.firmware?.includes('rc') ? (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800">RC</span>
          ) : router.firmware === '7.14.3' ? (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-success-100 text-success-800">+</span>
          ) : router.firmware === '6.49.13' ? (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-warning-100 text-warning-800">!</span>
          ) : null}
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center">
          CPU
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </div>
      ),
      accessorKey: (router: Router) => `${router.cpuUsage}%`
    },
    {
      header: (
        <div className="flex items-center">
          RAM
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </div>
      ),
      accessorKey: (router: Router) => (
        <ProgressBar 
          value={router.ramUsage || 0}
          max={100}
          variant={router.ramUsage && router.ramUsage > 70 ? "warning" : "default"}
          size="sm"
          className="w-32"
        />
      )
    },
    {
      header: (
        <div className="flex items-center">
          Disk
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </div>
      ),
      accessorKey: (router: Router) => (
        <ProgressBar
          value={router.diskUsage || 0}
          max={100}
          variant={router.diskUsage && router.diskUsage > 80 ? "success" : "default"}
          size="sm"
          className="w-32"
        />
      )
    },
    {
      header: (
        <div className="text-center">Actions</div>
      ),
      accessorKey: (router: Router) => (
        <div className="flex justify-center space-x-1">
          <Button size="icon" className="h-8 w-8 p-1 text-white bg-primary-500 hover:bg-primary-600">
            <Terminal className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8 p-1 text-white bg-primary-500 hover:bg-primary-600">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8 p-1 text-white bg-primary-500 hover:bg-primary-600">
            <User className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8 p-1 text-white bg-primary-500 hover:bg-primary-600">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8 p-1 text-white bg-danger-500 hover:bg-danger-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];
  
  if (isLoading) {
    return <div className="text-center p-4">Loading routers...</div>;
  }
  
  if (error) {
    return <div className="text-center p-4 text-danger-500">Error loading routers</div>;
  }
  
  return (
    <div className="bg-white rounded-b-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={routers || []}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}
