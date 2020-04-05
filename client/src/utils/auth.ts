export const isLoggedIn = () => {
  return localStorage.getItem('authToken');
};

export const logOut = () => {
  localStorage.removeItem('authToken');
};
