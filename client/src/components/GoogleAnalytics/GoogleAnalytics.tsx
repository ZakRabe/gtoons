import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GoogleAnalyticsProps } from './types';
import ReactGA from 'react-ga';

let init = false;

const GoogleAnalytics: React.FunctionComponent<GoogleAnalyticsProps> = (
  props
) => {
  const dev = process.env.NODE_ENV === 'development';

  const {
    location: { pathname },
  } = props;

  useEffect(() => {
    if (!dev && !init) {
      localStorage.setItem('userSet', 'false');
      ReactGA.initialize('UA-178406181-1', { debug: true });
      init = true;
    }
  }, []);

  useEffect(() => {
    const isUserSet = localStorage.getItem('userSet') === 'true';
    const gaUserId = localStorage.getItem('gaUserId');

    if (!dev && !isUserSet && gaUserId) {
      ReactGA.set({ userId: gaUserId });
      localStorage.setItem('userSet', 'true');
    }
  });

  useEffect(() => {
    if (!dev) {
      ReactGA.pageview(pathname);
    }
  }, [pathname]);

  return null;
};

export default withRouter(GoogleAnalytics);
