import { useState } from 'react';
import { observer } from 'mobx-react';

import CalcInput from '@/lib/components/CalcInput';
import Parameter from '@/lib/components/Parameter';
import History from '@/lib/components/History';
import EditDefaults from '@/lib/components/EditDefaults';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { calculation } from '@/lib/stores';

const Calc = observer(() => {
  const [inputOpen, setInputOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editDefaultsOpen, setEditDefaultsOpen] = useState(false);
  const [tab, setTab] = useState<'BNS32' | 'BNS22' | 'SMA' | 'Base'>('Base');
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
    <div className='w-full mb-16'>
      <div>
        <CalcInput
          onClick={() => setInputOpen(true)}
          onHistoryClick={() => setHistoryOpen(true)}
          onEditDefaultsClick={() => setEditDefaultsOpen(true)}
          readOnly
        />
      </div>
      <Dialog open={inputOpen} onOpenChange={setInputOpen}>
        <DialogContent className='p-5 sm:p-0 bg-transparent border-0'>
          <CalcInput
            onClick={() => setInputOpen(!inputOpen)}
            onHistoryClick={() => setHistoryOpen(true)}
            onEditDefaultsClick={() => setEditDefaultsOpen(true)}
          />
        </DialogContent>
      </Dialog>

      {isDesktop ? (
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className='p-0'>
            <History onClose={() => setHistoryOpen(false)} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={historyOpen} onOpenChange={setHistoryOpen}>
          <DrawerContent>
            <History onClose={() => setHistoryOpen(false)} />
          </DrawerContent>
        </Drawer>
      )}

      {isDesktop ? (
        <Dialog open={editDefaultsOpen} onOpenChange={setEditDefaultsOpen}>
          <DialogContent className='p-0'>
            <EditDefaults onClose={() => setEditDefaultsOpen(false)} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={editDefaultsOpen} onOpenChange={setEditDefaultsOpen}>
          <DrawerContent>
            <EditDefaults onClose={() => setEditDefaultsOpen(false)} />
          </DrawerContent>
        </Drawer>
      )}

      <div className='p-3 sm:px-0'>
        <div className='flex gap-3 overflow-auto no-scrollbar'>
          {['Base', 'BNS32', 'BNS22', 'SMA'].map((item) => (
            <Badge
              key={item}
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
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 lg:gap-5'>
                {Object.keys(calculation.parameters[tab].general).map(
                  (parameter) => {
                    const p = parameter as
                      | 'thickness'
                      | 'width'
                      | 'bulkDensity';
                    return (
                      <Parameter
                        key={`${+calculation.createdAt}-${+calculation.createdAt}-${tab}-general-${parameter}`}
                        layer={tab}
                        group='general'
                        name={p}
                        value={calculation.parameters[tab].general[p].value}
                        unit={calculation.parameters[tab].general[p].unit}
                        parameters={[tab, 'general', p]}
                        onChange={parameterChangeHandler}
                      />
                    );
                  }
                )}
                <Parameter
                  key={`${+calculation.createdAt}-${tab}-general-total`}
                  computed={
                    calculation.parameters.type === 'length'
                      ? calculation.totalLayerWeights[tab]
                      : calculation.totalLayerLengths[tab]
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
                    key={`${+calculation.createdAt}-${tab}-bitumen-fraction`}
                    layer={tab}
                    group='bitumen'
                    name='fraction'
                    // @ts-ignore
                    value={calculation.parameters[tab].bitumen.fraction.value}
                    // @ts-ignore
                    unit={calculation.parameters[tab].bitumen.fraction.unit}
                    parameters={[tab, 'bitumen', 'fraction']}
                    onChange={parameterChangeHandler}
                  />
                  <Parameter
                    key={`${+calculation.createdAt}-${tab}-bitumen-total`}
                    computed={
                      tab === 'BNS32'
                        ? calculation.totalBNS32BitumenWeight
                        : tab === 'BNS22'
                        ? calculation.totalBNS22BitumenWeight
                        : calculation.totalSMABitumenWeight
                    }
                    name='weight'
                    unit='t'
                    readOnly
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          {'limestone' in calculation.parameters[tab] && (
            <AccordionItem value='limestone'>
              <AccordionTrigger>Limestone</AccordionTrigger>
              <AccordionContent className='grid gap-8 md:gap-4 lg:gap-5'>
                {
                  // @ts-ignore
                  calculation.parameters[tab].limestone.map(
                    // @ts-ignore
                    (item, index) => (
                      <div
                        className='grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-5'
                        key={`${+calculation.createdAt}-${tab}-limestone-${index}-div`}
                      >
                        <Parameter
                          key={`${+calculation.createdAt}-${tab}-limestone-${index}-thickness`}
                          name='thickness'
                          value={item.thickness.value}
                          unit={item.thickness.unit}
                          disabled
                        />
                        <Parameter
                          key={`${+calculation.createdAt}-${tab}-limestone-${index}-percentage`}
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
                            key={`${+calculation.createdAt}-${tab}-limestone-${index}-total`}
                            computed={
                              tab === 'BNS32'
                                ? calculation.totalBNS32LimestoneWeight[index]
                                : calculation.totalBNS22LimestoneWeight[index]
                            }
                            value={
                              tab === 'BNS32'
                                ? calculation.totalBNS32LimestoneWeight[index]
                                : calculation.totalBNS22LimestoneWeight[index]
                            }
                            name='weight'
                            unit='t'
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
