import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export function Header({ toggleMobileMenu }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold ml-2 md:ml-0">Router List</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-full md:w-64 pl-10"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary-500">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary-500">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 bg-gray-300 text-gray-700">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
