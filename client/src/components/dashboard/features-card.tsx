import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CloudDownload, ShieldCheck, Terminal, 
  TrendingUp, CalendarCheck, TriangleAlert 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturesCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-6 bg-primary-50 hover:bg-primary-100 transition h-auto"
          >
            <CloudDownload className="text-primary-500 text-2xl mb-2 h-6 w-6" />
            <span className="text-sm font-medium text-gray-700">Batch Updates</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-6 bg-primary-50 hover:bg-primary-100 transition h-auto"
          >
            <ShieldCheck className="text-primary-500 text-2xl mb-2 h-6 w-6" />
            <span className="text-sm font-medium text-gray-700">Security Scan</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-6 bg-primary-50 hover:bg-primary-100 transition h-auto"
          >
            <Terminal className="text-primary-500 text-2xl mb-2 h-6 w-6" />
            <span className="text-sm font-medium text-gray-700">Fleet Commands</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-6 bg-primary-50 hover:bg-primary-100 transition h-auto"
          >
            <TrendingUp className="text-primary-500 text-2xl mb-2 h-6 w-6" />
            <span className="text-sm font-medium text-gray-700">Performance</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg p-4">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Report</span>
            <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium p-0 h-auto">
              View All
            </Button>
          </div>
          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
            <div className="flex items-center text-sm">
              <CalendarCheck className="text-success-500 mr-2 h-4 w-4" />
              <span>Firmware updates completed for 15 routers</span>
            </div>
            <div className="flex items-center text-sm mt-2">
              <TriangleAlert className="text-warning-500 mr-2 h-4 w-4" />
              <span>3 routers need attention</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
