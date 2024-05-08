import { observer } from 'mobx-react';
import { BiSun, BiMoon } from 'react-icons/bi';

import { appStore } from '@/lib/stores';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ThemeToggler = observer(() => {
  return (
    <Button
      size='icon'
      variant='ghost'
      className='rounded-full'
      onClick={() => {
        appStore.setTheme(appStore.theme === 'dark' ? 'light' : 'dark');
        toast(
          `${appStore.theme === 'dark' ? '🌙' : '☀️'} Switched to ${
            appStore.theme
          } mode`
        );
      }}
    >
      {appStore.theme === 'dark' ? <BiMoon size={20} /> : <BiSun size={20} />}
    </Button>
  );
});

export default ThemeToggler;
