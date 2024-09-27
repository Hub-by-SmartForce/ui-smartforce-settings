import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState
} from 'react';
import {
  SFThemeProvider,
  SFStylesProvider,
  createSFTheme,
  SFTheme
} from 'sfui';
import {
  AreasProvider,
  CustomerProvider,
  MediaProvider,
  SubscriptionProvider,
  ThemeTypeContext,
  UserProvider,
  TimezonesProvider,
  TourProvider,
  AppNotificationsProvider
} from '../../src';
import { Login } from './Login/Login';
import { Main } from './Main/Main';
import { Switch, Route, Redirect } from 'react-router-dom';
import { RouteAuthGuard } from './RouteAuthGuard';

export const AuthContext = createContext<{
  isLogged: boolean;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
}>({ isLogged: false, setIsLogged: () => {} });

export const App = () => {
  const { themeType } = React.useContext(ThemeTypeContext);
  const theme: SFTheme = createSFTheme(themeType);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      <MediaProvider>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>

          <RouteAuthGuard path="/main" isLogged={isLogged}>
            <TourProvider>
              <SFThemeProvider theme={theme}>
                <SFStylesProvider injectFirst>
                  <UserProvider>
                    <TimezonesProvider>
                      <CustomerProvider>
                        <SubscriptionProvider>
                          <AreasProvider>
                            <AppNotificationsProvider>
                              <Main />
                            </AppNotificationsProvider>
                          </AreasProvider>
                        </SubscriptionProvider>
                      </CustomerProvider>
                    </TimezonesProvider>
                  </UserProvider>
                </SFStylesProvider>
              </SFThemeProvider>
            </TourProvider>
          </RouteAuthGuard>

          <Route path="*">
            <Redirect to={'/'} />
          </Route>
        </Switch>
      </MediaProvider>
    </AuthContext.Provider>
  );
};
