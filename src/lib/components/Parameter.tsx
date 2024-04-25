import { useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';

const Parameter = ({ readOnly = false }: { readOnly?: boolean }) => {
  const [value, setValue] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9.]*$/;
    if (regex.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  const onClick = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch((err) => {
        toast.error('Could not copy text: ', err);
      });
  };

  return (
    <div className='relative'>
      <Input
        value={value}
        onChange={onChange}
        className={`w-full h-full outline-none text-center rounded-md !pt-8 p-2.5 text-xl ${
          readOnly
            ? 'bg-primary text-primary-foreground font-bold'
            : 'bg-secondary'
        }`}
        placeholder='0'
        readOnly={readOnly}
        onClick={() => readOnly && onClick(value)}
      />
      <span
        className={`absolute top-2 w-full flex justify-center text-xs font-semibold ${
          readOnly ? 'text-primary-foreground' : ''
        }`}
      >
        Test
      </span>
    </div>
  );
};

export default Parameter;
