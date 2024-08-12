import React from 'react';
import { onKeyUp } from '../../Helpers';

export interface InteractiveBoxProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const InteractiveBox = React.forwardRef<
  HTMLDivElement,
  InteractiveBoxProps
>(
  (
    { children, onClick, ...props }: InteractiveBoxProps,
    ref
  ): React.ReactElement<InteractiveBoxProps> => {
    return (
      <div
        {...props}
        ref={ref}
        role="button"
        tabIndex={0}
        onKeyUp={(e) => onKeyUp(e, onClick)}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);
