import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { FiPercent, FiFile, FiLayers, FiLogOut } from 'react-icons/fi';

import ThemeToggler from '@/lib/components/ThemeToggler';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { page } from '@/lib/stores';
import { ReactNode } from 'react';

const Menu = observer(() => {
  const navigate = useNavigate();

  const icons: { icon: ReactNode; route: '' | 'reports' | 'layers' }[] = [
    { icon: <FiPercent size={16} />, route: '' },
    { icon: <FiFile size={16} />, route: 'reports' },
    { icon: <FiLayers size={16} />, route: 'layers' },
  ];

  return (
    <div className='flex-col w-full bg-card lg:rounded-full justify-center lg:border'>
      <Separator className='w-full lg:hidden' />
      <div className='flex w-full justify-center p-2 lg:py-4'>
        <div className='flex w-full lg:flex-col items-center lg:justify-center justify-around max-w-[500px] gap-3'>
          {icons.map(({ icon, route }, index) => {
            return route === page.current ? (
              <div
                key={`menu-${index}`}
                className='text-primary rounded-full p-2.5'
              >
                {icon}
              </div>
            ) : (
              <Button
                variant='ghost'
                size='icon'
                className='p-0 rounded-full'
                key={`menu-${index}`}
                onClick={() => navigate(`/${route}`)}
                disabled={route !== ''}
              >
                {icon}
              </Button>
            );
          })}
          <Button
            variant='ghost'
            size='icon'
            className='p-0 rounded-full'
            onClick={() => {}}
          >
            <FiLogOut />
          </Button>
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
});

export default Menu;
