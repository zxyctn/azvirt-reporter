import { observer } from 'mobx-react';
import { BiSun, BiMoon } from 'react-icons/bi';

import { themeStore } from '@/lib/stores';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ThemeToggler = observer(() => {
  return (
    <Button
      size='icon'
      variant='ghost'
      className='rounded-full'
      onClick={() => {
        themeStore.setTheme(themeStore.theme === 'dark' ? 'light' : 'dark');
        toast(`${
            themeStore.theme === 'dark' ? '🌙' : '☀️'
          } Switched to ${themeStore.theme} mode`);
      }}
    >
      {themeStore.theme === 'dark' ? <BiMoon /> : <BiSun />}
    </Button>
  );
});

export default ThemeToggler;
