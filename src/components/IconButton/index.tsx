import React, { ComponentPropsWithoutRef } from 'react';

import './styles.css';

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  label?: string;
  icon?: React.ReactElement;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, ...rest }: IconButtonProps, forwardedRef) => {
    return (
      <button ref={forwardedRef} className="IconButtonRoot" {...rest}>
        {label}
        {icon}
      </button>
    );
  }
);

export default IconButton;
