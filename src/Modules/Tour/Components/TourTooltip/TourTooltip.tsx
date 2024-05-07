import React, { useEffect, useState } from 'react';
import styles from './TourTooltip.module.scss';
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
  preventOverflow?: boolean;
  width?: 'auto' | 'fit';
}

export const TourTooltip = ({
  children,
  preventOverflow = false,
  width = 'auto',
  placement,
  enterDelay,
  ...props
}: TourTooltipProps): React.ReactElement<TourTooltipProps> => {
  const [isOpen, setIsOpen] = useState(false);
  const [refTooltipElement, isTooltipOpen] = useTourTooltip(
    props.tourId,
    props.step
  );

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
        className={`${styles.tourTooltip} ${width === 'fit' ? styles.fit : ''}`}
        ref={refTooltipElement}
      >
        {children}
      </div>
    </SFTooltip>
  );
};
