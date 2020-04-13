import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthRouteProps } from './types';
import { isLoggedIn } from '../../utils/auth';
import { request } from '../../utils/api';

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) => {
  useEffect(() => {
    request({
      url: 'login/validateToken',
    })
      .then(() => {})
      .catch(() => {});
  }, []);

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
