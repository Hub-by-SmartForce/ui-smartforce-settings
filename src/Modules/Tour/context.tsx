import React, { FC, useCallback, useReducer } from 'react';
import { Tour } from './models';

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

type StartAction = {
  type: 'start';
  payload: Tour;
};

type EndAction = {
  type: 'end';
};

type BackAction = {
  type: 'back';
};

type NextAction = {
  type: 'next';
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
  payload: number[];
};

type TourContextAction =
  | CloseAction
  | SetReminderAction
  | DisableReminderAction
  | StartAction
  | EndAction
  | BackAction
  | NextAction;

function reducer(
  state: TourContextState,
  action: TourContextAction
): TourContextState {
  const { type } = action;

  switch (type) {
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
        action.payload.includes(state.tour?.id) &&
        state.step > 0
      ) {
        return {
          ...state,
          step: 0
        };
      }

      break;
    }

    case 'back': {
      if (state.step > 0) {
        return {
          ...state,
          step: state.step - 1
        };
      }
      break;
    }

    case 'next': {
      if (state.step > 0) {
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

export interface TourContextProps
  extends Omit<TourContextState, 'isReminderAvailable'> {
  status: TourStatus | undefined;
  setIsFeatureReminderOpen: (value: boolean) => void;
  onDisableReminder: () => void;
  onStart: (tour: Tour) => void;
  onClose: (tourIds: number[]) => void;
  onEnd: () => void;
  onBack: () => void;
  onNext: () => void;
}

const contextDefaultValues: TourContextProps = {
  tour: undefined,
  step: 0,
  isFeatureReminderOpen: false,
  status: undefined,
  setIsFeatureReminderOpen: () => {},
  onDisableReminder: () => {},
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

  const onStart = useCallback(
    (tour: Tour) => dispatch({ type: 'start', payload: tour }),
    []
  );

  const onEnd = useCallback(() => dispatch({ type: 'end' }), []);

  const onClose = useCallback(
    (tourIds: number[]) => dispatch({ type: 'close', payload: tourIds }),
    []
  );

  const onBack = useCallback(() => dispatch({ type: 'back' }), []);
  const onNext = useCallback(() => dispatch({ type: 'next' }), []);

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
