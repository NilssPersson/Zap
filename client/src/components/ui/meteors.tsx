import { cn } from '@/lib/utils';

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number || 20).fill(true);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {meteors.map((_, idx) => (
        <span
          key={'meteor' + idx}
          className={cn(
            'animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]',
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
          )}
          style={{
            top: Math.random() * 100 + '%', // Random vertical position within the container
            left: Math.random() * 100 + '%', // Random horizontal position within the container
            animationDelay: Math.random() * 0.8 + 's', // Random animation delay
            animationDuration: Math.random() * 8 + 2 + 's', // Random animation duration
          }}
        ></span>
      ))}
    </div>
  );
};
