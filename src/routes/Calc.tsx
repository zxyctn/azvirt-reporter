import { useState } from 'react';

import CalcInput from '@/lib/components/CalcInput';
import Parameter from '@/lib/components/Parameter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

      <div className='p-3 sm:px-0'>
        <div className='flex gap-3 overflow-auto'>
          <Badge variant='secondary' className='rounded-full cursor-pointer'>
            0/31
          </Badge>
          <Badge className='rounded-full cursor-pointer'>BNS32</Badge>
          <Badge variant='secondary' className='rounded-full cursor-pointer'>
            BNS22
          </Badge>
          <Badge variant='secondary' className='rounded-full cursor-pointer'>
            SMA
          </Badge>
        </div>
        <Accordion type='multiple' className='w-full'>
          <AccordionItem value='item-1'>
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 lg:gap-5'>
                <Parameter />
                <Parameter />
                <Parameter />
                <Parameter readOnly />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>Bitumen</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2 gap-3 md:gap-4 lg:gap-5'>
                <Parameter />
                <Parameter readOnly />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>Limestone</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-5'>
                <Parameter />
                <Parameter />
                <div className='col-span-2 sm:col-span-1'>
                  <Parameter readOnly />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Calc;
