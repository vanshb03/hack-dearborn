import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';
import { access } from 'fs';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<any>();
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const session = await supabase.auth.getSession();
    setUser(session?.data?.session?.user);
    setLoading(false);

    const { data: {subscription} } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setSessionData(() => session);
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
    checkAuth();
  }, [router]);
  return { user, loading, access_token: sessionData?.access_token };
}