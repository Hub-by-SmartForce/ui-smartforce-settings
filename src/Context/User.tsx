import React, { FC } from 'react';
import { User, UserSettings } from '../Models';

export type UserContextState = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  isOnboarding: boolean;
  setIsOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  userSettings: UserSettings | undefined;
  setUserSettings: React.Dispatch<
    React.SetStateAction<UserSettings | undefined>
  >;
};

const contextDefaultValues: UserContextState = {
  user: undefined,
  setUser: () => {},
  isOnboarding: false,
  setIsOnboarding: () => {},
  userSettings: undefined,
  setUserSettings: () => {}
};

export const UserContext =
  React.createContext<UserContextState>(contextDefaultValues);

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = React.useState<User>();
  const [isOnboarding, setIsOnboarding] = React.useState<boolean>(false);
  const [userSettings, setUserSettings] = React.useState<UserSettings>();

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isOnboarding,
        setIsOnboarding,
        userSettings,
        setUserSettings
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
