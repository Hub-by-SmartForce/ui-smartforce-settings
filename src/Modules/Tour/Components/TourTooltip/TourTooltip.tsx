import React, { useEffect, useState } from 'react';
import { SFTooltip, SFTooltipProps } from 'sfui';
import { useTourTooltip } from '../../hooks';
import {
  TourTooltipContentProps,
  TourTooltipContent
} from './TourTooltipContent/TourTooltipContent';

export interface TourTooltipProps
  extends TourTooltipContentProps,
    Pick<SFTooltipProps, 'placement' | 'enterDelay'> {
  children: React.ReactNode;
  tourId: number;
  preventOverflow?: boolean;
  width?: 'auto' | 'fit';
}

export const TourTooltip = ({
  children,
  tourId,
  preventOverflow = false,
  width = 'auto',
  placement,
  enterDelay,
  ...props
}: TourTooltipProps): React.ReactElement<TourTooltipProps> => {
  const [isOpen, setIsOpen] = useState(false);
  const [refTooltipElement, isTooltipOpen] = useTourTooltip(tourId, props.step);

  useEffect(() => {
    if (enterDelay) {
      setTimeout(() => setIsOpen(true), enterDelay);
    } else {
      setIsOpen(true);
    }
  }, [enterDelay]);

  return (
    <SFTooltip
      open={isOpen && isTooltipOpen}
      title=""
      placement={placement}
      content={<TourTooltipContent {...props} />}
      PopperProps={
        preventOverflow
          ? {
              modifiers: {
                preventOverflow: {
                  enabled: true,
                  boundariesElement: 'scrollParent'
                }
              }
            }
          : {}
      }
    >
      <div
        ref={refTooltipElement}
        style={width === 'fit' ? { width: 'fit-content' } : {}}
      >
        {children}
      </div>
    </SFTooltip>
  );
};
