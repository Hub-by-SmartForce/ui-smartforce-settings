import React, { FC, useState } from 'react';
import { Tour } from './models';

export type TourStatus = 'active' | 'paused';

export type TourContextState = {
  tour: Tour | undefined;
  step: number;
  status: TourStatus | undefined;
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
  status: undefined,
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
  const [status, setStatus] = useState<TourStatus | undefined>();
  const [isFeatureReminderOpen, setIsFeatureReminderOpen] =
    useState<boolean>(false);

  const onStart = (tour: Tour) => {
    setTour(tour);
    setStep(1);
    setStatus('active');
  };

  const onClose = () => {
    if (status === 'active') {
      setStep(0);
      setStatus('paused');
    }
  };

  const onEnd = () => {
    setTour(undefined);
    setStep(-1);
    setStatus(undefined);
  };

  const onBack = () => setStep((s) => s - 1);

  const onNext = () => {
    if (status === 'active') {
      setStep((s) => s + 1);
    }
  };

  return (
    <TourContext.Provider
      value={{
        tour,
        step,
        status,
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
