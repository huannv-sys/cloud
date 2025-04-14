import { Button } from "@/components/ui/button";
import { 
  Plus, Wand2, Search, FileSpreadsheet, 
  Filter, SortAsc, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RouterActionsProps {
  onAddRouter: () => void;
  onEzConfig: () => void;
  onRediscover: () => void;
  onGenerateCsv: () => void;
  totalPages: number;
}

export function RouterActions({
  onAddRouter,
  onEzConfig,
  onRediscover,
  onGenerateCsv,
  totalPages = 1
}: RouterActionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showGroups, setShowGroups] = useState(false);
  
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  return (
    <div className="bg-white p-3 border-b border-gray-200 flex flex-wrap items-center gap-2">
      <div 
        className="inline-flex items-center text-sm text-gray-700 mr-2 cursor-pointer"
        onClick={() => setShowGroups(!showGroups)}
      >
        <svg 
          className="w-4 h-4 mr-1" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M2 9a3 3 0 0 1 0 6v-6Z" />
          <path d="M14 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          <path d="M14 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          <path d="M22 9a3 3 0 0 1 0 6v-6Z" />
          <path d="M5 9h14" />
          <path d="M5 15h5" />
          <path d="M17 15h2" />
        </svg>
        <span>Groups</span>
      </div>
      
      <Button 
        onClick={onAddRouter}
        className="inline-flex items-center bg-success-500 hover:bg-success-600 text-white"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Router
      </Button>
      
      <Button 
        onClick={onEzConfig}
        className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white"
        size="sm"
      >
        <Wand2 className="h-4 w-4 mr-1" />
        EZ Config
      </Button>
      
      <Button 
        onClick={onRediscover}
        className="inline-flex items-center bg-primary-100 text-primary-600 hover:bg-primary-200"
        size="sm"
      >
        <Search className="h-4 w-4 mr-1" />
        Rediscover Routers
      </Button>
      
      <Button 
        onClick={onGenerateCsv}
        className="inline-flex items-center bg-primary-100 text-primary-600 hover:bg-primary-200"
        size="sm"
      >
        <FileSpreadsheet className="h-4 w-4 mr-1" />
        Generate CSV
      </Button>
      
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-600">Page:</span>
        <div className="inline-flex rounded overflow-hidden">
          <Button 
            onClick={() => goToPage(currentPage - 1)}
            variant="ghost" 
            size="sm" 
            className="px-2 py-1 h-auto border-r border-gray-200"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input 
            type="number" 
            value={currentPage} 
            onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
            className="h-8 w-12 text-center border-none"
            min={1}
            max={totalPages}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2 py-1 h-auto"
            disabled={true}
          >
            / {totalPages}
          </Button>
          <Button 
            onClick={() => goToPage(currentPage + 1)}
            variant="ghost" 
            size="sm" 
            className="px-2 py-1 h-auto border-l border-gray-200"
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
