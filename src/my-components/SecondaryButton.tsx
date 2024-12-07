import * as React from 'react';
import { cn } from '../js/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  title: string;
  icon?: React.ReactNode;
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, title, icon, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          'flex gap-2 items-center p-2 bg-slate-800 rounded-md hover:bg-slate-950 text-white dark:bg-white dark:text-black hover:dark:bg-slate-100',
          className,
        )}
        ref={ref}
        {...props}
      >
        {icon} {title}
      </button>
    );
  },
);

export default SecondaryButton;
