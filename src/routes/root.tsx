import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

import Menu from '@/lib/components/Menu';
import { Toaster } from '@/components/ui/sonner';
import { history, page, supabaseStore } from '@/lib/stores';

const Root = () => {
  const [session, setSession] = useState<Session | null>();
  const navigate = useNavigate();

  useEffect(() => {
    supabaseStore.client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabaseStore.client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        supabaseStore.user = session.user;
        if (history.isFetched === false) {
          supabaseStore.fetchHistory();
        }
      } else {
        supabaseStore.user = null;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const route = location.pathname.split('/azvirt-reporter/')[1];
    if (
      session === null &&
      route !== 'register' &&
      route !== 'login' &&
      route !== 'forgot-password'
    ) {
      navigate('/azvirt-reporter/login');
    } else if (
      session &&
      (route === 'login' || route === 'register' || route === 'forgot-password')
    ) {
      navigate('/azvirt-reporter/');
    }
  }, [session]);

  useEffect(() => {
    page.setCurrent(
      location.pathname.split('/azvirt-reporter/')[1] as
        | ''
        | 'reports'
        | 'layers'
    );
  }, [location.pathname]);

  return (
    <div className='w-full h-full'>
      <Toaster />
      {session && (
        <div className='fixed lg:h-full w-full lg:w-max flex items-center bottom-0 lg:left-5 z-50'>
          <Menu />
        </div>
      )}
      <div className='flex justify-center h-full w-full'>
        <div className='max-w-[800px] sm:p-5 m-auto h-full'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;
