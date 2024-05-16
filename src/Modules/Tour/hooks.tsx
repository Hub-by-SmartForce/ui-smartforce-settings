import { RefObject, useContext, useEffect, useRef } from 'react';
import { TourContext, TourStatus, TourStepOptions } from './context';
import { Tour } from './models';
import { saveTourAction } from '../../Services';

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

export function useCloseTour(tourIds: (TourStepOptions | number)[]) {
  const onClose = useContext(TourContext).onClose;

  useEffect(() => {
    return () => onClose(tourIds);
  }, []);
}

export function useSaveTourAction(url: string, app: string) {
  const { tour, status, step } = useContext(TourContext);
  const refLastState = useRef<{
    tour: Tour | undefined;
    status: TourStatus | undefined;
    step: number;
  }>();

  useEffect(() => {
    try {
      if (
        refLastState.current &&
        refLastState.current.tour &&
        refLastState.current.status === 'paused' &&
        (!status ||
          (status === 'active' && tour?.id !== refLastState.current.tour.id))
      ) {
        saveTourAction(url, app, 'exit', refLastState.current.tour.id);
      }

      if (tour && tour.id !== refLastState.current?.tour?.id) {
        saveTourAction(url, app, 'start', tour.id);
      }

      if (refLastState.current?.tour && tour) {
        if (
          refLastState.current.tour &&
          tour.id === refLastState.current.tour.id
        ) {
          if (refLastState.current.status === 'active' && status === 'paused') {
            saveTourAction(
              url,
              app,
              'pause',
              refLastState.current.tour.id,
              refLastState.current.step
            );
          } else if (
            refLastState.current.status === 'paused' &&
            status === 'active'
          ) {
            saveTourAction(url, app, 'resume', refLastState.current.tour.id);
          }
        } else {
        }
      }

      if (
        refLastState.current?.tour &&
        !status &&
        refLastState.current?.status === 'active'
      ) {
        saveTourAction(url, app, 'finish', refLastState.current.tour.id);
      }
    } catch (e) {
      console.error('Error on useSaveTourAction hook: ', e);
    }

    refLastState.current = {
      tour,
      status,
      step
    };
  }, [tour, status, step]);
}
