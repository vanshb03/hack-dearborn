'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from "./hooks/useAuth";
import HomePage from './home/page';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  return <HomePage />;
}
