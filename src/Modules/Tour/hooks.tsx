import { RefObject, useContext, useEffect, useRef } from 'react';
import { TourContext } from './context';

export function useTourTooltip(
  tourId: number,
  step: number
): [RefObject<HTMLDivElement>, boolean] {
  const tourContext = useContext(TourContext);
  const refElement = useRef<HTMLDivElement>(null);
  const isOpen = tourContext.tour?.id === tourId && tourContext.step === step;

  useEffect(() => {
    if (isOpen) {
      refElement.current?.scrollIntoView({ block: 'center' });
    }
  }, [isOpen]);

  return [refElement, isOpen];
}

export function useCloseTour(tourIds: number[]) {
  const onClose = useContext(TourContext).onClose;

  useEffect(() => {
    return () => onClose(tourIds);
  }, []);
}
