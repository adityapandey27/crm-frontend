import React from 'react';
import clsx from 'classnames';

export default function Input({ label, help, className = '', ...props }) {
  return (
    <div className={clsx('w-full')}>
      {label && <div className="text-sm mb-2 font-medium">{label}</div>}
      <input
        {...props}
        className={clsx('w-full rounded-xl border px-3 py-2 bg-white/60 border-white/10 input-glass', className)}
      />
      {help && <div className="text-xs mt-1 text-muted">{help}</div>}
    </div>
  );
}
