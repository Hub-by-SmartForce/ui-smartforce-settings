import React, { FC } from 'react';
import { AppNotification } from '../Models';

export type AppNotificationsContextState = {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  setNotificationsRead: (idList: string[]) => void;
};

const contextDefaultValues: AppNotificationsContextState = {
  notifications: [],
  setNotifications: () => {},
  setNotificationsRead: () => {}
};

export const AppNotificationsContext =
  React.createContext<AppNotificationsContextState>(contextDefaultValues);

export const AppNotificationsProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = React.useState<AppNotification[]>(
    []
  );

  const setNotificationsRead = (idList: string[]) => {
    const date = new Date().toISOString();
    setNotifications((list) =>
      list.map((n) => {
        if (idList.includes(n.id)) {
          return {
            ...n,
            read_at: date
          };
        } else {
          return n;
        }
      })
    );
  };

  return (
    <AppNotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        setNotificationsRead
      }}
    >
      {children}
    </AppNotificationsContext.Provider>
  );
};
