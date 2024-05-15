import React, { CSSProperties, useEffect, useState } from 'react';
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
  topZIndex?: boolean;
  style?: CSSProperties;
}

export const TourTooltip = ({
  children,
  preventOverflow = false,
  width = 'auto',
  placement,
  enterDelay,
  topZIndex = false,
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
      classes={{
        arrow: styles.arrow,
        popperArrow: `${styles.popperArrow} ${
          topZIndex ? styles.topZIndex : ''
        }`
      }}
      open={isOpen && isTooltipOpen}
      title=""
      placement={placement}
      content={<TourTooltipContent {...props} />}
      PopperProps={{
        style: props.style,
        modifiers: preventOverflow
          ? {
              preventOverflow: {
                enabled: true,
                boundariesElement: 'scrollParent'
              }
            }
          : {}
      }}
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
