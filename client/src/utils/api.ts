import axios, { AxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: `/api/`,
});

export const request = (options: AxiosRequestConfig) => {
  const onSuccess = (response: any) => {
    // check for the auth token
    const { token } = response.headers;
    if (token) {
      localStorage.setItem('authToken', token);
    }

    return response.data;
  };

  const onError = (error: any) => {
    console.error('Request Failed:', error.config);

    if (error.response) {
      // Request was made but server responded with something other than 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);

      switch (error.response.status) {
        case 401:
          // this means the token was invalid, and we should clear it
          localStorage.removeItem('authToken');
          break;
      }
    } else {
      // Something else happened while setting up the request that triggered an error
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error.response || error.message);
  };

  return client({
    ...options,
    headers: {
      auth: localStorage.getItem('authToken'),
    },
  })
    .then(onSuccess)
    .catch(onError);
};

export const queryParams = (params: any) => {
  console.log(params);
  const query = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return `?${query.join('&')}`;
};
