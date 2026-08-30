'use client';

import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const button = cva(
  'inline-flex items-center justify-center gap-2 font-display font-bold uppercase tracking-[0.08em] transition-all duration-200 ease-rule disabled:pointer-events-none disabled:opacity-45 active:translate-y-px',
  {
    variants: {
      variant: {
        primary: 'bg-gold text-void hover:bg-gold-300 shadow-gold',
        solid: 'bg-bone text-void hover:bg-white',
        outline: 'border border-bone/25 text-bone hover:border-gold hover:text-gold',
        ghost: 'text-bone/75 hover:text-gold',
        clay: 'bg-clay text-bone hover:bg-clay-400',
        whatsapp: 'border border-success/45 text-success hover:bg-success hover:text-void',
      },
      size: {
        sm: 'h-9 px-4 text-[0.6875rem]',
        md: 'h-11 px-6 text-xs',
        lg: 'h-14 px-8 text-sm',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

type ButtonLinkProps = React.ComponentProps<typeof Link> & VariantProps<typeof button>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(button({ variant, size }), className)} {...props} />;
}

export { button as buttonStyles };
