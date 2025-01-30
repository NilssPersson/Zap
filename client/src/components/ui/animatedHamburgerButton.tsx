import { motion, MotionConfig } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AnimatedHamburgerButton({
  active,
}: {
  active: boolean;
}) {
  return (
    <MotionConfig transition={{ duration: 0.4, ease: 'easeInOut' }}>
      <motion.div
        initial={false}
        className="relative h-6 w-6 rounded-lg"
        animate={active ? 'open' : 'closed'}
      >
        <motion.span
          style={{
            left: '50%',
            top: '25%',
            x: '-50%',
            y: '-50%',
          }}
          className={cn(
            'absolute h-0.5 w-5 rounded',
            active ? 'bg-white' : 'bg-foreground'
          )}
          variants={{
            open: {
              rotate: ['0deg', '0deg', '45deg'],
              top: ['25%', '50%', '50%'],
            },
            closed: {
              rotate: ['45deg', '0deg', '0deg'],
              top: ['50%', '50%', '25%'],
            },
          }}
        />
        <motion.span
          style={{
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%',
          }}
          className={cn(
            'absolute h-0.5 w-5 rounded',
            active ? 'bg-white' : 'bg-foreground'
          )}
          variants={{
            open: {
              rotate: ['0deg', '0deg', '-45deg'],
            },
            closed: {
              rotate: ['-45deg', '0deg', '0deg'],
            },
          }}
        />
        <motion.span
          style={{
            left: '50%',
            bottom: '25%',
            x: '-50%',
            y: '50%',
          }}
          className={cn(
            'absolute h-0.5 w-5 rounded',
            active ? 'bg-white' : 'bg-foreground'
          )}
          variants={{
            open: {
              rotate: ['0deg', '0deg', '45deg'],
              bottom: ['25%', '50%', '50%'],
            },
            closed: {
              rotate: ['45deg', '0deg', '0deg'],
              bottom: ['50%', '50%', '25%'],
            },
          }}
        />
      </motion.div>
    </MotionConfig>
  );
}
