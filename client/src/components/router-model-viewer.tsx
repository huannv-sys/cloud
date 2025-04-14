import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FileUpload, FilePdf, FileText, FileImage, Info, Download } from 'lucide-react';

interface RouterModelViewerProps {
  routerId: number;
  modelName?: string;
}

interface ModelInfo {
  modelName: string;
  imageUrl: string | null;
  dataPath: string | null;
  hasVsdxFile: boolean;
}

export function RouterModelViewer({ routerId, modelName }: RouterModelViewerProps) {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Fetch router model info
  useEffect(() => {
    if (!routerId) return;
    
    const fetchModelInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/routers/${routerId}/model`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch router model');
        }
        
        const data = await response.json();
        setModelInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching router model:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModelInfo();
  }, [routerId]);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!uploadFile || !modelName) return;
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('modelFile', uploadFile);
      
      const response = await fetch(`/api/router-models/${modelName}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      const result = await response.json();
      
      // Update router with the new model information
      if (routerId) {
        const updateResponse = await fetch(`/api/routers/${routerId}/model`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            modelDataPath: result.filePath,
          }),
        });
        
        if (!updateResponse.ok) {
          throw new Error('Failed to update router model info');
        }
      }
      
      // Refresh model info
      const refreshResponse = await fetch(`/api/routers/${routerId}/model`);
      const refreshData = await refreshResponse.json();
      setModelInfo(refreshData);
      
      // Reset file input
      setUploadFile(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      console.error('Error uploading model:', err);
    } finally {
      setUploading(false);
    }
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading router model information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-40 gap-4">
            <Info className="h-10 w-10 text-yellow-500" />
            <p className="text-muted-foreground">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Router Model</CardTitle>
        <CardDescription>
          {modelInfo?.modelName 
            ? `Model: ${modelInfo.modelName}` 
            : 'No model information available'}
        </CardDescription>
      </CardHeader>
      
      <Separator />
      
      <Tabs defaultValue="diagram" className="w-full">
        <TabsList className="w-full justify-start px-6 pt-2">
          <TabsTrigger value="diagram">Diagram</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diagram" className="p-6">
          {modelInfo?.hasVsdxFile ? (
            <div className="flex flex-col items-center gap-4">
              <div className="border rounded-lg p-4 w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FilePdf className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{modelInfo.modelName}.vsdx</p>
                    <p className="text-sm text-muted-foreground">Visio Diagram</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                The VSDX file contains the detailed diagram of this router model. 
                You can open it with Microsoft Visio or compatible applications.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No diagram file available for this model</p>
              <p className="text-sm text-muted-foreground">Upload a VSDX file to visualize router ports and connections</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="p-6">
          <div className="flex flex-col gap-4">
            <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
              <FileUpload className="h-10 w-10 text-primary" />
              <p className="font-medium">Upload a VSDX file for this router model</p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                VSDX files contain detailed diagrams of the router's physical ports, 
                connections, and specifications to help you with deployment.
              </p>
              
              <div className="w-full max-w-md mt-2">
                <input
                  type="file"
                  accept=".vsdx"
                  onChange={handleFileChange}
                  className="w-full border border-input rounded-lg p-2 text-sm"
                />
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={!uploadFile || uploading}
                className="mt-2"
              >
                {uploading ? 'Uploading...' : 'Upload VSDX File'}
              </Button>
            </div>
            
            {modelInfo?.modelName && (
              <div className="rounded-lg border p-4">
                <p className="font-medium">Current Router Model: {modelInfo.modelName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading a new diagram will replace any existing file.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}