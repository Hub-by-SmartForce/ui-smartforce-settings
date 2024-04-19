import React, { FC, useState } from 'react';
import { Tour } from './models';

export type TourContextState = {
  tour: Tour | undefined;
  step: number;
  onStart: (tour: Tour) => void;
  onClose: () => void;
  onEnd: () => void;
  onBack: () => void;
  onNext: () => void;
};

const contextDefaultValues: TourContextState = {
  tour: undefined,
  step: 0,
  onStart: () => {},
  onClose: () => {},
  onEnd: () => {},
  onBack: () => {},
  onNext: () => {}
};

export const TourContext =
  React.createContext<TourContextState>(contextDefaultValues);

export const TourProvider: FC = ({ children }) => {
  const [tour, setTour] = useState<Tour | undefined>();
  const [step, setStep] = useState<number>(-1);

  const onStart = (tour: Tour) => {
    setTour(tour);
    setStep(1);
  };

  const onClose = () => {
    setStep(0);
  };

  const onEnd = () => {
    setTour(undefined);
    setStep(-1);
  };

  const onBack = () => setStep((s) => s - 1);
  const onNext = () => setStep((s) => s + 1);

  return (
    <TourContext.Provider
      value={{
        tour,
        step,
        onStart,
        onClose,
        onEnd,
        onBack,
        onNext
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
