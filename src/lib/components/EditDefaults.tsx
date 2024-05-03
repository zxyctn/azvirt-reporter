import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Cross1Icon, SymbolIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import Parameter from '@/lib/components/Parameter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deepCopy } from '@/lib/utils';
import { editDefaults, defaults, supabaseStore } from '@/lib/stores';

const EditDefaults = observer(({ onClose }: { onClose: () => void }) => {
  const [tab, setTab] = useState<'BNS32' | 'BNS22' | 'SMA' | 'Base'>('Base');
  const [key, setKey] = useState<string>(+new Date() + '');

  const parameterChangeHandler = (value: number, parameters: any[]) => {
    if (parameters.length < 3) return;
    const [layer, group, parameter] = parameters;
    editDefaults.setParameter(layer, group, parameter, value);
  };

  const limestonePercentageChangeHandler = (
    value: number,
    parameters: any[]
  ) => {
    if (parameters.length < 2) return;
    const [layer, index] = parameters;
    editDefaults.setLimestonePercentage(layer, index, value);
  };

  const onSave = async () => {
    defaults.update(deepCopy(editDefaults));
    defaults.updateLocalStorage();
    await supabaseStore.updateDefaults(editDefaults);
    toast.success('Defaults updated successfully');
    onClose();
  };

  const onSync = async () => {
    await supabaseStore.fetchDefaults();
    setKey(+new Date() + '');
    toast.success('Defaults synced successfully');
  };

  useEffect(() => {
    editDefaults.update(deepCopy(defaults));
  }, []);

  return (
    <div className='bg-card rounded-lg'>
      <div className='p-3 sm:p-5 flex items-center justify-between mb-3 sticky top-0 pb-1 sm:pb-1 sm:pt-3 rounded-t-lg'>
        <div className='flex gap-2 items-center'>
          <span className='font-semibold pb-0.5'>Defaults</span>
        </div>
        <Cross1Icon className='w-3 h-3 cursor-pointer' onClick={onClose} />
      </div>
      <div className='p-3 sm:p-5 pt-0 sm:pt-0  overflow-auto max-h-[500px]'>
        <div className='p-3 sm:px-0'>
          <div className='flex gap-3 overflow-auto no-scrollbar'>
            {['Base', 'BNS32', 'BNS22', 'SMA'].map((item) => (
              <Badge
                key={`${key}-defaults-${item}`}
                onClick={() => setTab(item as any)}
                variant={tab === item ? 'default' : 'secondary'}
                className='cursor-pointer rounded-full'
              >
                {item}
              </Badge>
            ))}
          </div>
          <Accordion
            type='multiple'
            className='w-full'
            defaultValue={['general', 'bitumen', 'limestone']}
          >
            <AccordionItem value='general'>
              <AccordionTrigger>General</AccordionTrigger>
              <AccordionContent>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-5'>
                  {Object.keys(defaults[tab].general).map(
                    (parameter, index) => {
                      const p = parameter as
                        | 'thickness'
                        | 'width'
                        | 'bulkDensity';
                      return (
                        <div
                          className={`sm:col-span-1 ${
                            index === 2 ? 'col-span-2' : ''
                          }`}
                          key={`${key}-defaults-${tab}-general-${parameter}`}
                        >
                          <Parameter
                            layer={tab}
                            group='general'
                            name={p}
                            value={defaults[tab].general[p].value}
                            unit={defaults[tab].general[p].unit}
                            parameters={[tab, 'general', p]}
                            onChange={parameterChangeHandler}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            {['BNS32', 'BNS22', 'SMA'].includes(tab) && (
              <AccordionItem value='bitumen'>
                <AccordionTrigger>Bitumen</AccordionTrigger>
                <AccordionContent>
                  <Parameter
                    key={`${key}-defaults-${tab}-bitumen-fraction`}
                    layer={tab}
                    group='bitumen'
                    name='fraction'
                    // @ts-ignore
                    value={defaults[tab].bitumen.fraction.value}
                    // @ts-ignore
                    unit={defaults[tab].bitumen.fraction.unit}
                    parameters={[tab, 'bitumen', 'fraction']}
                    onChange={parameterChangeHandler}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            {'limestone' in defaults[tab] && (
              <AccordionItem value='limestone'>
                <AccordionTrigger>Limestone</AccordionTrigger>
                <AccordionContent className='grid gap-8 md:gap-4 lg:gap-5'>
                  {
                    // @ts-ignore
                    defaults[tab].limestone.map(
                      // @ts-ignore
                      (item, index) => (
                        <div
                          className='grid grid-cols-2 gap-3 md:gap-4 lg:gap-5'
                          key={`${key}-defaults-${tab}-limestone-${index}-div`}
                        >
                          <Parameter
                            key={`${key}-defaults-${tab}-limestone-${index}-thickness`}
                            name='thickness'
                            value={item.thickness.value}
                            unit={item.thickness.unit}
                            disabled
                          />
                          <Parameter
                            key={`${key}-defaults-${tab}-limestone-${index}-percentage`}
                            layer={tab}
                            group='limestone'
                            name='percentage'
                            parameters={[tab, index]}
                            value={item.percentage.value}
                            unit={item.percentage.unit}
                            onChange={limestonePercentageChangeHandler}
                          />
                        </div>
                      )
                    )
                  }
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>

      <div className='p-3 sm:p-5 flex justify-end w-full'>
        <div className='flex justify-between px-3 sm:px-0 w-full'>
          <Button
            onClick={onSync}
            variant='ghost'
            className='flex gap-2 items-center'
          >
            <SymbolIcon className='w-3 h-3' /> <span>Sync</span>
          </Button>
          <div className='flex gap-3'>
            <Button onClick={onClose} variant='secondary'>
              Cancel
            </Button>
            <Button onClick={onSave} className='font-semibold'>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditDefaults;
