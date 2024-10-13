'use client';

import { Button } from "@nextui-org/button"
import Image from "next/image"
import googleIcon from '../assets/google.svg';
import Logo from '../assets/logoWOBack.png';
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { UserResponse } from "@supabase/supabase-js";

const Login = () => {
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

  console.log(user, error)
  useEffect(() => {
    fetchUserData();
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchUserData();
      }
    });

  }, []);

  const image = () => <Image 
      src={googleIcon}
        alt="google icon" 
        width={20} 
        height={20} 
      />
  const logo = () => <Image 
      src={Logo}
        alt="Logo" 
        width={100} 
        height={100} 
      />
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white shadow-lg border border-gray-200 h-[600px] w-[600px] flex justify-center items-center rounded-lg m-5 flex-col gap-5">
        <h1 className="text-black">
          Welcome to AiSchedular.ai
        </h1>
        {logo()}
        <form method="POST" action={'api/auth'}>
          <Button type="submit" className="bg-black text-white" endContent={image()}>
            Login with Google
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login;