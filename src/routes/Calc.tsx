import { useState } from 'react';

import CalcInput from '@/lib/components/CalcInput';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Calc = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='w-full max-w-[1000px]'>
      <div onClick={() => setOpen(true)}>
        <CalcInput readOnly />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='p-3 border-0 bg-transparent'>
          <div className='rounded-lg'>
            <CalcInput />
          </div>
          <Button className='w-full font-bold'>CALC</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calc;
