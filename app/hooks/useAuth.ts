import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const session = await supabase.auth.getSession();
    setUser(session?.data?.session?.user);
    setLoading(false);

    const { data: {subscription} } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        router.push('/login');
      }
    });

    // Clean up the listener
    return () => {
      subscription?.unsubscribe();
    };
  }
  useEffect(() => {
    // Check if a user is authenticated when the app loads
    checkAuth();
  }, [router]);

  return { user, loading };
}