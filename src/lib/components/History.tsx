import { Cross1Icon, TimerIcon } from '@radix-ui/react-icons';

import { useMediaQuery } from '@/hooks/use-media-query';
import { history } from '@/lib/stores';

const History = ({ onClose }: { onClose: () => void }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className='bg-card rounded-lg'>
      <div className='p-3 sm:p-5 flex items-center justify-between mb-3 sticky top-0 pb-1 sm:pb-1 sm:pt-3 rounded-t-lg'>
        <div className='flex gap-2 items-center'>
          <TimerIcon className='w-5 h-5' />{' '}
          <span className='font-semibold text-lg pb-0.5'>History</span>
        </div>
        {isDesktop && (
          <Cross1Icon className='w-5 h-5 cursor-pointer' onClick={onClose} />
        )}
      </div>
      <div className='p-3 sm:p-5 pt-0 sm:pt-0  overflow-auto max-h-[500px]'>
        {[...history.calculations].reverse().map((calculation, index) => (
          <div
            className={`flex justify-between items-center ${
              index < history.calculations.length - 1
                ? 'border-b mb-3 pb-3'
                : 'pb-1'
            }`}
            key={calculation.id}
          >
            <div>
              <div className='text-xs text-secondary-foreground/50 font-semibold'>
                {new Date(calculation.createdAt).toDateString().slice(4)}
              </div>
              <div className='text-xs text-secondary-foreground/50'>
                {new Date(calculation.createdAt).toTimeString().slice(0, 5)}
              </div>
            </div>
            <div className='text-lg font-semibold'>{calculation.value}</div>
          </div>
        ))}
        {!history.calculations.length && (
          <div className='text-center text-sm italic text-card-foreground/50'>
            No calculations yet
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
