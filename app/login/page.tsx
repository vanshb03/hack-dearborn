'use client';

import { Button } from "@/components/ui/button"
import Image from "next/image"
import googleIcon from '../assets/google.svg';
import Logo from '../assets/logoWOBack.png';
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { UserResponse } from "@supabase/supabase-js";

export default function Login() {
  const [user, setUser] = useState<UserResponse>();
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    const user: UserResponse = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    } else {
      setError('User not logged in');
    }
  };

  useEffect(() => {
    fetchUserData();
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchUserData();
      }
    });

  }, []);
  console.log(user, error)

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 dark:bg-foreground dark:text-background">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center items-center ">
          <Image 
            src={Logo}
            alt="Logo" 
            width={100} 
            height={100}
          />
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground dark:text-card-foreground">
            Enter your email and password to access your account.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <form method="post" action="api/auth">
              <Button variant="outline" type="submit" className="w-full">
                <Image 
                  src={googleIcon}
                  alt="google icon" 
                  width={20} 
                  height={20} 
                />
                <span className="ml-2">Login with Google</span>
            </Button>
            </form>
          </div>
         </div> 
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
  );
}