import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthRouteProps } from './types';
import { isLoggedIn } from '../../utils/auth';

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) => {
  const renderAuthRoute = () => {
    return isLoggedIn() ? (
      <Route {...props}></Route>
    ) : (
      <Redirect to="/login"></Redirect>
    );
  };

  return renderAuthRoute();
};

export default AuthRoute;
