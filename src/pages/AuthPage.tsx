import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, User, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const navigate = useNavigate();
  
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email-signin') as string;
    const password = formData.get('password-signin') as string;
    
    try {
      // First check if user exists
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) throw userError;
      
      const userExists = users?.some(user => user.email === email);
      
      if (!userExists) {
        toast.error("Account not found. Please sign up first.");
        setActiveTab("signup");
        return;
      }
      
      // If user exists, proceed with sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Successfully signed in!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('name') as string;
    const email = formData.get('email-signup') as string;
    const password = formData.get('password-signup') as string;
    
    try {
      // Check if user already exists
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) throw userError;
      
      const userExists = users?.some(user => user.email === email);
      
      if (userExists) {
        toast.error("Account already exists. Please sign in instead.");
        setActiveTab("signin");
        return;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Account created! Please check your email for verification.");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      // Google OAuth will handle the redirect automatically
      // The AuthCallback component will handle the navigation after successful login
      
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
      <div className="animate-fade-in-up w-full max-w-md">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/90 border border-primary/10 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="signup">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/80">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex gap-2 items-center">
                    <User className="h-4 w-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex gap-2 items-center">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-purple via-primary to-brand-purple bg-shimmer animate-text-shimmer bg-clip-text text-transparent">
                  Welcome to ScreenVault
                </h1>
                <p className="text-muted-foreground mt-2 animate-fade-in opacity-0" style={{ animationDelay: '200ms' }}>
                  Your personal screen recording management platform
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <Button
                variant="outline"
                className="w-full mb-6 border-primary/20 hover:border-primary/40 shadow-sm hover:shadow transition-all duration-300 animate-fade-in opacity-0" 
                style={{ animationDelay: '300ms' }}
                disabled={isLoading}
                onClick={handleGoogleAuth}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none">
                  <g clipPath="url(#clip0_13183_10121)">
                    <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"></path>
                    <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"></path>
                    <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"></path>
                    <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"></path>
                  </g>
                </svg>
                Continue with Google
              </Button>
              
              <div className="relative mb-6 animate-fade-in opacity-0" style={{ animationDelay: '400ms' }}>
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-primary/10"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            
              <TabsContent value="signin" className="animate-bounce-in opacity-0" style={{ animationDelay: '500ms' }}>
                <form onSubmit={handleSignIn}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-signin" className="text-foreground/80">Email</Label>
                      <Input
                        id="email-signin"
                        name="email-signin"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        className="border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/40 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password-signin" className="text-foreground/80">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password-signin"
                        name="password-signin"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/40 transition-all duration-300"
                      />
                    </div>
                    <Button type="submit" className="w-full group relative overflow-hidden transition-all duration-300 hover:shadow-md" disabled={isLoading}>
                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? "Signing in..." : "Sign In"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="animate-bounce-in opacity-0" style={{ animationDelay: '500ms' }}>
                <form onSubmit={handleSignUp}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        className="border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/40 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup" className="text-foreground/80">Email</Label>
                      <Input
                        id="email-signup"
                        name="email-signup"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        className="border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/40 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup" className="text-foreground/80">Password</Label>
                      <Input
                        id="password-signup"
                        name="password-signup"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/40 transition-all duration-300"
                      />
                    </div>
                    <Button type="submit" className="w-full group relative overflow-hidden transition-all duration-300 hover:shadow-md" disabled={isLoading}>
                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? "Creating account..." : "Create Account"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground text-center animate-fade-in opacity-0" style={{ animationDelay: '600ms' }}>
                By continuing, you agree to our{" "}
                <Link to="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
