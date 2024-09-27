import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

export interface RouteAuthGuardProps extends RouteProps {
  isLogged: boolean;
}

export const RouteAuthGuard = ({
  children,
  isLogged,
  ...rest
}: RouteAuthGuardProps) => (
  <Route
    {...rest}
    children={() => (isLogged === true ? children : <Redirect to="/login" />)}
  />
);
