import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

const supabase = createClient(
  `${process.env.VITE_SUPABASE_URL}`,
  `${process.env.VITE_SUPABASE_API_KEY}`
);

const Root = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    <div>
      <Outlet />
    </div>
  );
};

export default Root;
