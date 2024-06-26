import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { FiPercent, FiFile, FiLayers, FiLogOut, FiLogIn } from 'react-icons/fi';
import { toast } from 'sonner';
import type { ReactNode } from 'react';

import ThemeToggler from '@/lib/components/ThemeToggler';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { appStore, page, supabaseStore } from '@/lib/stores';

const Menu = observer(() => {
  const navigate = useNavigate();

  const icons: {
    icon: ReactNode;
    route: '' | 'reports' | 'layers' | 'login';
  }[] = [
    { icon: <FiPercent size={20} />, route: '' },
    { icon: <FiFile size={20} />, route: 'reports' },
    { icon: <FiLayers size={20} />, route: 'layers' },
  ];

  if (appStore.isGuest) {
    icons.push({ icon: <FiLogIn size={20} />, route: 'login' });
  }

  const logOut = async () => {
    const { error } = await supabaseStore.client.auth.signOut();

    if (error) {
      console.error('Error logging out:', error.message);
      toast.error('Error logging out');
      throw error;
    }

    toast.success('Logged out');
  };

  return (
    <div className='flex-col w-full bg-card lg:rounded-full justify-center lg:border'>
      <Separator className='w-full lg:hidden' />
      <div className='flex w-full justify-center p-3 lg:py-4'>
        <div className='flex w-full lg:flex-col items-center lg:justify-center justify-around max-w-[500px] gap-3'>
          {icons.map(({ icon, route }, index) => {
            return route === page.current ? (
              <div
                key={`menu-${index}`}
                className='text-primary rounded-full p-2'
              >
                {icon}
              </div>
            ) : (
              <Button
                variant='ghost'
                size='icon'
                className='p-0 rounded-full'
                key={`menu-${index}`}
                onClick={() => navigate(`/${route}/`)}
                disabled={route !== '' && route !== 'login'}
              >
                {icon}
              </Button>
            );
          })}
          {!appStore.isGuest && supabaseStore.user && (
            <Button
              variant='ghost'
              size='icon'
              className='p-0 rounded-full'
              onClick={logOut}
            >
              <FiLogOut size={20} />
            </Button>
          )}
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
});

export default Menu;
