import React, { FC, useCallback, useReducer } from 'react';
import { Tour } from './models';

function checkCanClose(
  tourId: number,
  step: number,
  options?: (TourStepOptions | number)[]
): boolean {
  if (!options) return true;
  else {
    const findOption = options.find((option) => {
      if (typeof option === 'number') {
        return tourId === option;
      } else {
        return tourId === option.tourId && step === option.step;
      }
    });

    return !!findOption;
  }
}

export type TourStatus = 'active' | 'paused';

export type TourContextState = {
  tour: Tour | undefined;
  step: number;
  isReminderAvailable: boolean;
  isFeatureReminderOpen: boolean;
};

function getStatus(state: TourContextState): TourStatus | undefined {
  if (!!state.tour && state.step === 0) return 'paused';
  else if (state.step > 0) return 'active';
  return;
}

type InitPausedAction = {
  type: 'init_paused';
  payload: Tour;
};

type StartAction = {
  type: 'start';
  payload: Tour;
};

type EndAction = {
  type: 'end';
};

type BackAction = {
  type: 'back';
  payload?: TourStepOptions;
};

type NextAction = {
  type: 'next';
  payload?: TourStepOptions;
};

type SetReminderAction = {
  type: 'set_reminder';
  payload: boolean;
};

type DisableReminderAction = {
  type: 'disable_reminder';
};

type CloseAction = {
  type: 'close';
  payload?: (TourStepOptions | number)[];
};

type TourContextAction =
  | CloseAction
  | SetReminderAction
  | DisableReminderAction
  | StartAction
  | InitPausedAction
  | EndAction
  | BackAction
  | NextAction;

function reducer(
  state: TourContextState,
  action: TourContextAction
): TourContextState {
  const { type } = action;

  switch (type) {
    case 'init_paused': {
      return {
        ...state,
        tour: action.payload,
        step: 0
      };
    }

    case 'start': {
      return {
        ...state,
        tour: action.payload,
        step: 1
      };
    }

    case 'end': {
      return {
        ...state,
        tour: undefined,
        step: -1
      };
    }

    case 'close': {
      if (
        state.tour &&
        state.step > 0 &&
        checkCanClose(state.tour.id, state.step, action.payload)
      ) {
        return {
          ...state,
          step: 0
        };
      }

      break;
    }

    case 'back': {
      const options: TourStepOptions | undefined = action.payload;

      if (
        state.step > 0 &&
        (!options ||
          (state.tour?.id === options.tourId && state.step === options.step))
      ) {
        return {
          ...state,
          step: state.step - 1
        };
      }
      break;
    }

    case 'next': {
      const options: TourStepOptions | undefined = action.payload;

      if (
        state.step > 0 &&
        (!options ||
          (state.tour?.id === options.tourId && state.step === options.step))
      ) {
        return {
          ...state,
          step: state.step + 1
        };
      }
      break;
    }

    case 'set_reminder': {
      return {
        ...state,
        isFeatureReminderOpen: action.payload
      };
    }

    case 'disable_reminder': {
      return {
        ...state,
        isReminderAvailable: false
      };
    }
  }

  return state;
}

function getInitialState() {
  return {
    tour: undefined,
    step: -1,
    isReminderAvailable: true,
    isFeatureReminderOpen: false
  };
}

export interface TourStepOptions {
  tourId: number;
  step: number;
}

export interface TourContextProps
  extends Omit<TourContextState, 'isReminderAvailable'> {
  status: TourStatus | undefined;
  setIsFeatureReminderOpen: (value: boolean) => void;
  onDisableReminder: () => void;
  onInitPaused: (tour: Tour) => void;
  onStart: (tour: Tour) => void;
  onClose: (options?: (TourStepOptions | number)[]) => void;
  onEnd: () => void;
  onBack: (options?: TourStepOptions) => void;
  onNext: (options?: TourStepOptions) => void;
}

const contextDefaultValues: TourContextProps = {
  tour: undefined,
  step: 0,
  isFeatureReminderOpen: false,
  status: undefined,
  setIsFeatureReminderOpen: () => {},
  onDisableReminder: () => {},
  onInitPaused: () => {},
  onStart: () => {},
  onClose: () => {},
  onEnd: () => {},
  onBack: () => {},
  onNext: () => {}
};

export const TourContext =
  React.createContext<TourContextProps>(contextDefaultValues);

export const TourProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const onInitPaused = useCallback(
    (tour: Tour) => dispatch({ type: 'init_paused', payload: tour }),
    []
  );

  const onStart = useCallback(
    (tour: Tour) => dispatch({ type: 'start', payload: tour }),
    []
  );

  const onEnd = useCallback(() => dispatch({ type: 'end' }), []);

  const onClose = useCallback(
    (options?: (TourStepOptions | number)[]) =>
      dispatch({ type: 'close', payload: options }),
    []
  );

  const onBack = useCallback(
    (options?: TourStepOptions) => dispatch({ type: 'back', payload: options }),
    []
  );

  const onNext = useCallback(
    (options?: TourStepOptions) => dispatch({ type: 'next', payload: options }),
    []
  );

  const setIsFeatureReminderOpen = useCallback(
    (payload: boolean) => dispatch({ type: 'set_reminder', payload }),
    []
  );

  const onDisableReminder = useCallback(
    () => dispatch({ type: 'disable_reminder' }),
    []
  );

  const status = getStatus(state);
  const isFeatureReminderOpen =
    state.isReminderAvailable && state.isFeatureReminderOpen;

  return (
    <TourContext.Provider
      value={{
        tour: state.tour,
        step: state.step,
        isFeatureReminderOpen,
        status,
        setIsFeatureReminderOpen,
        onDisableReminder,
        onInitPaused,
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
