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

export const InteractiveBox = ({
  className = '',
  style,
  children,
  onClick
}: InteractiveBoxProps): React.ReactElement<InteractiveBoxProps> => {
  return (
    <div
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
};
