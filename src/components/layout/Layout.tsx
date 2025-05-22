import React, { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { useUser } from "@/lib/UserContext";

export const Layout = () => {
  const { user, loading } = useUser();

  useEffect(() => {
    // Add animation class to body when component mounts
    document.body.classList.add('bg-background');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('bg-background');
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-accent/5 to-transparent"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-brand-purple/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-20">
        <Header />
        <div className="absolute top-2 right-8 z-30 flex items-center gap-2">
          {!loading && user && (
            <span className="text-sm font-medium text-foreground/80">
              {user.user_metadata?.full_name || user.email}
            </span>
          )}
          <Link to="/profile" className="block transition-transform hover:scale-105">
            <Avatar className="border-2 border-accent/50">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-muted">
                <UserRound className="w-5 h-5 text-accent" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
      
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" closeButton richColors />
    </div>
  );
};
