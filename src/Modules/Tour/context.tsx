import React, { FC, useState } from 'react';
import { Tour } from './models';

export type TourContextState = {
  tour: Tour | undefined;
  step: number;
  isFeatureReminderOpen: boolean;
  setIsFeatureReminderOpen: (value: boolean) => void;
  onStart: (tour: Tour) => void;
  onClose: () => void;
  onEnd: () => void;
  onBack: () => void;
  onNext: () => void;
};

const contextDefaultValues: TourContextState = {
  tour: undefined,
  step: 0,
  isFeatureReminderOpen: false,
  setIsFeatureReminderOpen: () => {},
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
  const [isFeatureReminderOpen, setIsFeatureReminderOpen] =
    useState<boolean>(false);

  const onStart = (tour: Tour) => {
    setTour(tour);
    setStep(1);
  };

  const onClose = () => {
    // Check if tour it's active
    if (step > 0) {
      setStep(0);
    }
  };

  const onEnd = () => {
    setTour(undefined);
    setStep(-1);
  };

  const onBack = () => setStep((s) => s - 1);

  const onNext = () => {
    if (step > 0) {
      setStep((s) => s + 1);
    }
  };

  return (
    <TourContext.Provider
      value={{
        tour,
        step,
        isFeatureReminderOpen,
        setIsFeatureReminderOpen,
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
