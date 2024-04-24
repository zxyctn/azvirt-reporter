import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

const CalcInput = ({ readOnly = false }: { readOnly?: boolean }) => {
  const [value, setValue] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9.]*$/;
    if (regex.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  return (
    <div className='relative'>
      <div className='absolute w-full top-3 flex justify-between h-min px-3'>
        {/* Settings menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='rounded-full p-0 m-0 w-6 h-6'>
              <DotsVerticalIcon className='w-3 h-3' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='right:0 absolute left-auto top-full w-auto'>
            <DropdownMenuItem>
              <span className='text-xs'>Edit defaults</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className='text-xs'>History</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Input type menu */}
        <div className='-mt-0.5'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge className='cursor-pointer'>Length</Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <span className='text-xs'>Length</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className='text-xs'>Weight</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Arbitrary item for symmetry */}
        <div></div>
      </div>
      {/* Input unit */}
      <span className='absolute sm:bottom-14 right-4 sm:right-5 bottom-12 font-medium'>
        Meters
      </span>
      {/* Input */}
      <Input
        value={value}
        onChange={onChange}
        className={`bg-secondary w-full h-full outline-none text-right sm:rounded-lg !pt-20 p-3 sm:!pt-20 sm:p-5 font-bold text-3xl ${
          readOnly ? 'rounded-none' : 'rounded-lg'
        }`}
        placeholder='0'
        readOnly={readOnly}
      />
    </div>
  );
};

export default CalcInput;