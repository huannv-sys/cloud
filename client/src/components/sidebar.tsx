import { Link, useLocation } from "wouter";
import { 
  Home, List, Activity, Tag, Lock, Lightbulb, 
  Network, Settings, Users, BarChart2, FlaskRound
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileMenuOpen: boolean;
}

export function Sidebar({ mobileMenuOpen }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { href: "/routers", icon: <List className="w-5 h-5" />, label: "Router List" },
    { href: "/router-health", icon: <Activity className="w-5 h-5" />, label: "Router Health" },
    { href: "/tags", icon: <Tag className="w-5 h-5" />, label: "Tags" },
    { href: "/account-security", icon: <Lock className="w-5 h-5" />, label: "Account Security" },
    { href: "/feature-request", icon: <Lightbulb className="w-5 h-5" />, label: "Feature Request" },
    { 
      href: "/topology", 
      icon: <Network className="w-5 h-5" />, 
      label: "Topology", 
      hasSubmenu: true,
      submenu: [
        { href: "/topology/hierarchy", label: "Hierarchy" },
        { href: "/topology/mapper", label: "Topology Mapper" },
        { href: "/topology/ospf", label: "OSPF Mapper" },
        { href: "/topology/bgp", label: "BGP Peer Info" }
      ]
    },
    { 
      href: "/admin-settings", 
      icon: <Settings className="w-5 h-5" />, 
      label: "Admin Settings",
      hasSubmenu: true,
      submenu: [
        { href: "/admin-settings/general", label: "General Settings" },
        { href: "/admin-settings/credentials", label: "Platform Credentials" },
        { href: "/admin-settings/notifications", label: "Admin Notifications" },
        { href: "/admin-settings/slack", label: "Slack Settings" },
        { href: "/admin-settings/firmware", label: "Admin Firmware" },
        { href: "/admin-settings/import", label: "Import Tool" }
      ]
    },
    { 
      href: "/users-manager", 
      icon: <Users className="w-5 h-5" />, 
      label: "Users Manager",
      hasSubmenu: true,
      submenu: [
        { href: "/users-manager/dashboard-users", label: "Dashboard Users" },
        { href: "/users-manager/subscribers", label: "Subscribers(end-users)" },
        { href: "/users-manager/groups", label: "Groups/Permissions" }
      ]
    },
    { 
      href: "/reports", 
      icon: <BarChart2 className="w-5 h-5" />, 
      label: "Reports",
      hasSubmenu: true,
      submenu: [
        { href: "/reports/firmware", label: "Firmware History" },
        { href: "/reports/speedtest", label: "Speedtest History" },
        { href: "/reports/router", label: "Router History" },
        { href: "/reports/task", label: "Task Status" },
        { href: "/reports/top-talkers", label: "Top Talkers" }
      ]
    },
    { href: "/beta-features", icon: <FlaskRound className="w-5 h-5" />, label: "Beta Features" }
  ];

  // Function to determine if a nav item or its submenu is active
  const isActive = (href: string) => {
    return location === href || location.startsWith(`${href}/`);
  };

  return (
    <aside className={cn(
      "w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0",
      mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <svg 
            viewBox="0 0 100 100" 
            className="h-8 w-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <circle cx="50" cy="50" r="40" />
            <path d="M50,10 L50,90" />
            <path d="M10,50 L90,50" />
            <path d="M25,25 L75,75" />
            <path d="M25,75 L75,25" />
          </svg>
          <span className="ml-2 text-xl font-semibold">ADMIRAL</span>
        </div>
      </div>
      
      <nav className="mt-5 px-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-1">
              <Link href={item.href}>
                <a className={cn(
                  "flex items-center justify-between py-2 px-4 rounded",
                  isActive(item.href) 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                )}>
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-xs"
                    >
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  )}
                </a>
              </Link>
              
              {item.hasSubmenu && isActive(item.href) && (
                <ul className="pl-12 mt-1 space-y-1">
                  {item.submenu?.map((subItem) => (
                    <li key={subItem.href}>
                      <Link href={subItem.href}>
                        <a className={cn(
                          "block py-1 text-sm",
                          location === subItem.href 
                            ? "text-primary-600 font-medium" 
                            : "text-gray-600 hover:text-primary-600"
                        )}>
                          {subItem.label}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
