import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";
import { useUser } from "@/lib/UserContext";

const Home = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-brand-purple/20 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            Store and Share Your <span className="text-primary">Screen Recordings</span>
          </h1>
          <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto animate-fadeInUp delay-200">
            Securely upload, organize and share your screen recordings with ease.
            The simplest way to manage all your video content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-300">
            <Link to="/upload">
              <Button size="lg" className="gap-2 animate-pulse-slow">
                <Upload className="h-5 w-5" />
                Upload a Recording
              </Button>
            </Link>
            <Link to="/videos">
              <Button variant="accent" size="lg" className="gap-2">
                Browse Videos
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      
      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 animate-fadeInUp">Ready to get started?</h2>
            <p className="mb-8 text-lg max-w-2xl mx-auto animate-fadeInUp delay-200">
              Join thousands of professionals who trust ScreenVault for their screen recording needs.
            </p>
            <Link to="/auth" className="animate-fadeInUp delay-300 inline-block">
              <Button variant="secondary" size="lg" className="shadow-lg border border-black/20 animate-pulse-slow">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
