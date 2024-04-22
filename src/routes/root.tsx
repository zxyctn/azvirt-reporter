import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

import { supabaseStore } from '@/lib/stores';
import { Toaster } from '@/components/ui/toaster';
import ThemeToggler from '@/lib/components/ThemeToggler';

const Root = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabaseStore.client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabaseStore.client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (
      session === null &&
      location.pathname !== '/register' &&
      location.pathname !== '/login' &&
      location.pathname !== '/forgot-password'
    ) {
      navigate('/login');
    } else if (
      session &&
      (location.pathname === '/login' ||
        location.pathname === '/register' ||
        location.pathname === '/forgot-password')
    ) {
      navigate('/');
    }
  }, [session]);

  return (
    <div className='w-full h-full'>
      <Toaster />
      <div className='absolute top-2 left-2'>
        <ThemeToggler />
      </div>

      <Outlet />
    </div>
  );
};

export default Root;
