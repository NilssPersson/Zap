import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-card hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isInteractive?: boolean;
  interactiveStyles?: string;
  inGrid?: boolean;
  isAnimated?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isAnimated = false,
      asChild = false,
      isInteractive = false,
      interactiveStyles = '',
      inGrid = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    if (isAnimated) {
      return (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        </motion.div>
      );
    }

    // If isInteractive is true, wrap the button in a motion.div to apply scale effects
    if (isInteractive) {
      return (
        <motion.div
          whileTap={{ scale: 0.85 }}
          className={cn(inGrid ? 'grid' : 'inline-block', interactiveStyles)}
          whileHover={{ scale: 1.05 }}
        >
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        </motion.div>
      );
    }

    // If not interactive, just return the button normally
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
