import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthRouteProps } from './types';
import { isLoggedIn } from '../../utils/auth';
import { request } from '../../utils/api';

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) => {
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    request({
      url: 'login/validateToken',
    })
      .then(() => {
        setVerified(true);
        // this means the token was still valid, so there's no need to be on this page
      })
      .catch(() => {});
  }, []);

  const renderAuthRoute = () => {
    return isLoggedIn() ? (
      <Route {...props}></Route>
    ) : (
      <Redirect to="/login"></Redirect>
    );
  };

  return verified ? renderAuthRoute() : null;
};

export default AuthRoute;
