import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/lib/UserContext";
import { uploadVideo } from "@/lib/supabase";

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      if (!videoTitle) {
        setVideoTitle(file.name.split('.').slice(0, -1).join('.'));
      }
    } else {
      toast.error("Please select a valid video file");
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      if (!videoTitle) {
        setVideoTitle(file.name.split('.').slice(0, -1).join('.'));
      }
    } else {
      toast.error("Please drop a valid video file");
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error("Please select a video file to upload");
      return;
    }
    
    if (!videoTitle.trim()) {
      toast.error("Please enter a title for your video");
      return;
    }

    if (!user) {
      toast.error("Please sign in to upload videos");
      navigate("/auth");
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadVideo(videoFile, videoTitle, user.id, (progress) => {
        setUploadProgress(progress);
      });
      
      toast.success("Video uploaded successfully!");
      setVideoFile(null);
      setVideoTitle("");
      setUploadProgress(0);
      navigate("/videos");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearSelected = () => {
    setVideoFile(null);
    setVideoTitle("");
  };

  return (
    <div className="container py-8 px-4 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
      <h1 className="text-3xl font-bold mb-2 text-center">Upload Your Screen Recording</h1>
      <p className="text-muted-foreground text-center mb-8">
        Upload and share your screen recordings securely
      </p>
      
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>
            Select a screen recording video file from your computer
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                videoFile ? 'border-primary' : 'border-muted'
              }`}
            >
              {!videoFile ? (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Drag and drop your video file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports MP4, WebM, MOV, AVI (max 200MB)
                  </p>
                  <Button 
                    variant="outline" 
                    className="relative"
                    onClick={() => document.getElementById('videoFile')?.click()}
                  >
                    Choose Video
                    <Input
                      id="videoFile"
                      type="file"
                      accept="video/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-primary/20 p-4 rounded-full mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3L19 12L5 21V3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-1">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearSelected}
                    className="text-muted-foreground hover:text-destructive gap-1"
                  >
                    <X className="h-4 w-4" />
                    Remove Video
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoTitle">Video Title</Label>
              <Input
                id="videoTitle"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter a title for your video"
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-in-out" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full"
            disabled={!videoFile || isUploading || !videoTitle.trim()}
            onClick={handleUpload}
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadPage;
