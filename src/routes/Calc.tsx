import { useState } from 'react';
import { observer } from 'mobx-react';

import CalcInput from '@/lib/components/CalcInput';
import Parameter from '@/lib/components/Parameter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { calculation } from '@/lib/stores';

const Calc = observer(() => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'BNS32' | 'BNS22' | 'SMA' | 'Base'>('Base');

  const parameterChangeHandler = (value: number, parameters: any[]) => {
    if (parameters.length < 3) return;
    const [layer, group, parameter] = parameters;
    calculation.parameters.setParameter(layer, group, parameter, value);
  };

  const limestonePercentageChangeHandler = (
    value: number,
    parameters: any[]
  ) => {
    if (parameters.length < 2) return;
    const [layer, index] = parameters;
    calculation.parameters.setLimestonePercentage(layer, index, value);
  };

  return (
    <div className='w-full max-w-[1000px]'>
      <div onClick={() => setOpen(true)}>
        <CalcInput readOnly />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='p-3 border-0 bg-transparent'>
          <CalcInput onClick={() => setOpen(!open)} />
        </DialogContent>
      </Dialog>

      <div className='p-3 sm:px-0'>
        <div className='flex gap-3 overflow-auto no-scrollbar'>
          {['Base', 'BNS32', 'BNS22', 'SMA'].map((item) => (
            <Badge
              onClick={() => setTab(item as any)}
              variant={tab === item ? 'default' : 'secondary'}
              className='cursor-pointer rounded-full'
            >
              {item}
            </Badge>
          ))}
        </div>
        <Accordion type='multiple' className='w-full'>
          <AccordionItem value='general'>
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 lg:gap-5'>
                {Object.keys(calculation.parameters[tab].general).map(
                  (parameter) => {
                    const p = parameter as
                      | 'thickness'
                      | 'width'
                      | 'bulkDensity';
                    return (
                      <Parameter
                        key={`${tab}-general-${parameter}`}
                        layer={tab}
                        group='general'
                        name={p}
                        value={calculation.parameters[tab].general[p].value}
                        unit={calculation.parameters[tab].general[p].unit}
                        onChange={parameterChangeHandler}
                      />
                    );
                  }
                )}
                <Parameter
                  key={`${tab}-general-total`}
                  computed={
                    tab === 'Base'
                      ? calculation.totalBaseWeight
                      : tab === 'BNS32'
                      ? calculation.totalBNS32Weight
                      : tab === 'BNS22'
                      ? calculation.totalBNS22Weight
                      : calculation.totalSMAWeight
                  }
                  name={
                    calculation.parameters.type === 'length'
                      ? 'weight'
                      : 'length'
                  }
                  unit={calculation.parameters.unit === 'm' ? 't' : 'm'}
                  readOnly
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          {['BNS32', 'BNS22', 'SMA'].includes(tab) && (
            <AccordionItem value='bitumen'>
              <AccordionTrigger>Bitumen</AccordionTrigger>
              <AccordionContent>
                <div className='grid grid-cols-2 gap-3 md:gap-4 lg:gap-5'>
                  <Parameter
                    key={`${tab}-bitumen-fraction`}
                    layer={tab}
                    group='bitumen'
                    name='fraction'
                    // @ts-ignore
                    value={calculation.parameters[tab].bitumen.fraction.value}
                    // @ts-ignore
                    unit={calculation.parameters[tab].bitumen.fraction.unit}
                    onChange={parameterChangeHandler}
                  />
                  <Parameter
                    key={`${tab}-bitumen-total`}
                    computed={
                      tab === 'BNS32'
                        ? calculation.totalBNS32BitumenWeight
                        : tab === 'BNS22'
                        ? calculation.totalBNS22BitumenWeight
                        : calculation.totalSMABitumenWeight
                    }
                    name={
                      calculation.parameters.type === 'length'
                        ? 'weight'
                        : 'length'
                    }
                    unit={calculation.parameters.unit === 'm' ? 't' : 'm'}
                    readOnly
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          {'limestone' in calculation.parameters[tab] && (
            <AccordionItem value='limestone'>
              <AccordionTrigger>Limestone</AccordionTrigger>
              <AccordionContent className='grid gap-3 md:gap-4 lg:gap-5'>
                {
                  // @ts-ignore
                  calculation.parameters[tab].limestone.map(
                    // @ts-ignore
                    (item, index) => (
                      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-5'>
                        <Parameter
                          key={`${tab}-limestone-${index}-thickness`}
                          name='thickness'
                          value={item.thickness.value}
                          unit={item.thickness.unit}
                          disabled
                        />
                        <Parameter
                          key={`${tab}-limestone-${index}-percentage`}
                          layer={tab}
                          group='limestone'
                          name='percentage'
                          parameters={[tab, index]}
                          value={item.percentage.value}
                          unit={item.percentage.unit}
                          onChange={limestonePercentageChangeHandler}
                        />
                        <div className='col-span-2 sm:col-span-1'>
                          <Parameter
                            key={`${tab}-limestone-${index}-total`}
                            computed={
                              tab === 'BNS32'
                                ? calculation.totalBNS32LimestoneWeight[index]
                                : calculation.totalBNS22LimestoneWeight[index]
                            }
                            value={
                              // @ts-ignore
                              calculation.parameters[tab].limestone[index]
                                .percentage.value
                            }
                            name={
                              calculation.parameters.type === 'length'
                                ? 'weight'
                                : 'length'
                            }
                            unit={
                              calculation.parameters.unit === 'm' ? 't' : 'm'
                            }
                            readOnly
                          />
                        </div>
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
  );
});

export default Calc;
