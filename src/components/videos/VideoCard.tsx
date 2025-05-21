import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Video, getVideoUrl, deleteVideo } from "@/lib/supabase";
import { toast } from "sonner";

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const url = getVideoUrl(video.storage_path);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error(error.message || "Failed to download video");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await deleteVideo(video.id, video.storage_path);
      toast.success("Video deleted successfully");
      // The parent component will handle refreshing the list
    } catch (error: any) {
      toast.error(error.message || "Failed to delete video");
    }
  };

  return (
    <Link to={`/videos/${video.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="video-card">
          <img 
            src={video.thumbnail_url || '/placeholder.svg'} 
            alt={video.title} 
            className="video-thumbnail"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-background/90 rounded-full p-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg truncate">{video.title}</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
