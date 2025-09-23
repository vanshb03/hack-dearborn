'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/createSupaBaseClient";
import { UserResponse } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Login() {
  const [user, setUser] = useState<UserResponse>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchUserData = async () => {
    const user: UserResponse = await supabase.auth.getUser();
    if (user?.data?.user) {
      setUser(user);
      router.push('/');
    }
  };

  useEffect(() => {
    fetchUserData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        setError('Check your email for the confirmation link!');
        setIsLoading(false);
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="min-h-screen flex">
        {/* Image Panel */}
        <div 
          className={`relative w-1/2 overflow-hidden flex items-center justify-center transition-all duration-700 ease-in-out transform ${
            isSignUp ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/collage.jpg"
              alt="New York City" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 text-center space-y-8 p-8 max-w-md">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                {isSignUp ? 'Sign Up' : 'Welcome Back!'}
              </h1>
              <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                {isSignUp 
                  ? 'Join thousands of users managing their time efficiently with our powerful calendar app.'
                  : 'Manage your schedule, track your tasks, and stay organized with our intuitive calendar interface.'
                }
              </p>
            </div>
            
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div 
          className={`relative w-1/2 flex items-center justify-center p-8 transition-all duration-700 ease-in-out transform ${
            isSignUp ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center space-y-4 pb-8">
                <CardTitle className="text-3xl font-bold">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  {isSignUp 
                    ? 'Start your productivity journey today' 
                    : 'Continue to your dashboard'
                  }
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 pb-8">
                <form onSubmit={handleAuth} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                      className="h-12 text-base"
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full h-12 text-base font-medium mt-8"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </Button>
                </form>
                
                <div className="text-center pt-4">
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setEmail('');
                      setPassword('');
                    }}
                    disabled={isLoading}
                    className="text-base"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Sign up"
                    }
                  </Button>
                </div>
                
                {error && (
                  <div className={`p-4 border rounded-lg transition-all duration-300 ${
                    error.includes('Check your email') 
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                      : 'bg-destructive/10 border-destructive/20'
                  }`}>
                    <p className={`text-sm text-center font-medium ${
                      error.includes('Check your email')
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-destructive'
                    }`}>
                      {error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}