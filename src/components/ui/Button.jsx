import React from 'react';
import clsx from 'classnames';

export default function Button({ children, className = '', variant = 'solid', size = 'md', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-150 focus:outline-none';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };
  const variants = {
    solid: 'btn-accent text-white',
    ghost: 'bg-white/10 border border-white/8 text-slate-900',
    outline: 'bg-transparent border border-white/10 text-slate-900'
  };
  return (
    <button
      className={clsx(base, sizes[size], variants[variant], 'shadow-sm', className)}
      {...props}
    >
      {children}
    </button>
  );
}
