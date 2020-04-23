import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthRouteProps } from './types';
import { isLoggedIn } from '../../utils/auth';
import { request } from '../../utils/api';

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    request({
      url: 'login/validateToken',
    }).finally(() => setChecked(true));
  }, []);

  const renderAuthRoute = () => {
    return isLoggedIn() ? (
      <Route {...props}></Route>
    ) : (
      <Redirect to="/login"></Redirect>
    );
  };

  return checked ? renderAuthRoute() : null;
};

export default AuthRoute;
