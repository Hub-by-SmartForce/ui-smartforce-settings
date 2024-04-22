import React, { useContext, useEffect } from 'react';
import { SFTooltip, SFTooltipProps } from 'sfui';
import { useTourTooltip } from '../../hooks';
import {
  TourTooltipContentProps,
  TourTooltipContent
} from './TourTooltipContent/TourTooltipContent';
import { TourContext } from '../../context';

export interface TourTooltipProps
  extends TourTooltipContentProps,
    Pick<SFTooltipProps, 'placement'> {
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
  ...props
}: TourTooltipProps): React.ReactElement<TourTooltipProps> => {
  const { onClose } = useContext(TourContext);
  const [refTooltipElement, isTooltipOpen] = useTourTooltip(tourId, props.step);

  useEffect(() => {
    return () => onClose();
  }, []);

  return (
    <SFTooltip
      open={isTooltipOpen}
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
