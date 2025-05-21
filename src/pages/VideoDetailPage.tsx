import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash, ArrowLeft, AlertCircle } from "lucide-react";
import { getVideo, getVideoUrl, deleteVideo, downloadVideo, Video } from "@/lib/supabase";
import { toast } from "sonner";
import { useUser } from "@/lib/UserContext";

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        const videoData = await getVideo(id);
        setVideo(videoData);
        
        // Get the video URL for playback
        const url = await getVideoUrl(videoData.storage_path);
        setVideoUrl(url);
      } catch (error: any) {
        setError(error.message || "Failed to fetch video");
        toast.error(error.message || "Failed to fetch video");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleDownload = async () => {
    if (!video) return;
    
    try {
      await downloadVideo(video.storage_path, `${video.title}.mp4`);
      toast.success("Download started");
    } catch (error: any) {
      toast.error(error.message || "Failed to download video");
    }
  };

  const handleDelete = async () => {
    if (!video || !user) return;
    
    try {
      await deleteVideo(video.id, video.storage_path);
      toast.success("Video deleted successfully");
      navigate("/videos");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete video");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4 max-w-5xl mx-auto">
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container py-8 px-4 max-w-5xl mx-auto">
        <Link to="/videos" className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to videos</span>
        </Link>
        <div className="py-12 text-center">
          <div className="bg-destructive/20 inline-flex rounded-full p-4 mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-medium mb-2">Error Loading Video</h3>
          <p className="text-muted-foreground mb-6">{error || "Video not found"}</p>
          <Button onClick={() => navigate("/videos")}>
            Back to Videos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-5xl mx-auto">
      <Link to="/videos" className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to videos</span>
      </Link>
      
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="text-muted-foreground mb-6">
        Uploaded on {new Date(video.created_at).toLocaleDateString()}
      </p>
      
      <Card className="overflow-hidden mb-6 bg-black">
        <div className="aspect-video flex items-center justify-center bg-black">
          {videoUrl ? (
            <video 
              controls 
              className="w-full h-full" 
              poster={video.thumbnail_url || "/placeholder.svg"}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-white">Loading video player...</div>
          )}
        </div>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download Video
        </Button>
        {user && user.id === video.user_id && (
          <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash className="h-4 w-4" />
            Delete Video
          </Button>
        )}
      </div>
      
      {video.description && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{video.description}</p>
        </div>
      )}
    </div>
  );
};

export default VideoDetailPage;
