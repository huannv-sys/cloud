import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RouterHealthCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>ROUTER HEALTH OVERVIEW</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CPU Meter */}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>CPU</span>
            <span className="font-medium">59</span>
          </div>
          <div className="w-full h-6 bg-gray-100 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-sm relative" 
              style={{ width: '59%' }}
            >
              {/* Yellow warning section */}
              <div 
                className="absolute right-0 h-full bg-yellow-500" 
                style={{ width: '2%' }}
              />
              {/* Red danger indicator at the end */}
              <div 
                className="absolute right-0 h-full bg-red-500" 
                style={{ width: '1%' }}
              />
            </div>
          </div>
        </div>
        
        {/* RAM Meter */}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>RAM</span>
            <span className="font-medium">35</span>
          </div>
          <div className="w-full h-6 bg-gray-100 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-sm" 
              style={{ width: '35%' }}
            />
            <div 
              className="h-full bg-yellow-500 rounded-sm ml-auto" 
              style={{ 
                width: '13%', 
                marginTop: '-24px', // Adjust to match the height of the bar
              }}
            />
          </div>
        </div>
        
        {/* Disk Meter */}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>Disk</span>
            <span className="font-medium">47</span>
          </div>
          <div className="w-full h-6 bg-gray-100 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-sm relative" 
              style={{ width: '47%' }}
            >
              {/* Small orange section */}
              <div 
                className="absolute right-0 h-full bg-orange-500" 
                style={{ width: '3%' }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}