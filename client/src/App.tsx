import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import RouterList from "@/pages/router-list";
import RouterHealth from "@/pages/router-health";
import MeshDetails from "@/pages/mesh-details";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/routers" component={RouterList} />
      <Route path="/router-health" component={RouterHealth} />
      <Route path="/mesh/:id" component={MeshDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar mobileMenuOpen={mobileMenuOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleMobileMenu={toggleMobileMenu} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <Router />
          </main>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
