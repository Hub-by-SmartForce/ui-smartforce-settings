import React from 'react';
import { onKeyUp } from '../../Helpers';

export interface InteractiveBoxProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const InteractiveBox = React.forwardRef<
  HTMLDivElement,
  InteractiveBoxProps
>(
  (
    { className = '', style, children, onClick }: InteractiveBoxProps,
    ref
  ): React.ReactElement<InteractiveBoxProps> => {
    return (
      <div
        ref={ref}
        className={className}
        style={style}
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
