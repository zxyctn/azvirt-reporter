import { useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { camelCaseToWords } from '@/lib/utils';
import type { Parameter, ParameterProps } from '@/lib/types';

const Parameter = ({
  readOnly = false,
  name,
  unit,
  value,
  computed,
  parameters,
  onChange,
  disabled,
}: ParameterProps) => {
  const [val, setVal] = useState<string>(value ? value.toString() : '');

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9.]*$/;
    if (regex.test(e.target.value)) {
      setVal(e.target.value);
      onChange &&
        parameters &&
        onChange(parseFloat(e.target.value), parameters);
    }
  };

  const onClick = (text: string) => {
    navigator.clipboard
      .writeText(text)
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
        value={computed ? computed.toFixed(2) : val}
        onChange={changeHandler}
        className={`w-full h-full outline-none text-center rounded-md !pt-8 p-2.5 text-xl ${
          readOnly
            ? 'bg-primary text-primary-foreground font-bold'
            : 'bg-secondary'
        }`}
        placeholder='0'
        readOnly={readOnly}
        onClick={() => readOnly && onClick(value?.toString() || '')}
        disabled={disabled}
      />
      <span
        className={`absolute top-2 w-full flex justify-center text-xs font-semibold ${
          readOnly ? 'text-primary-foreground' : ''
        }`}
      >
        {`${camelCaseToWords(name)}${unit && ` (${unit})`}`}
      </span>
    </div>
  );
};

export default Parameter;
