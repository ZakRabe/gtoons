export const isValidEmail = (email: string) => {
  const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return regex.test(email);
};

export const validatePassword = (password: string) => {
  // 7 character min
  // 1 uppercase
  // 1 lowercase

  const passwordErrors = [];

  if (password.length < 7) {
    passwordErrors.push('Must be at least 7 characters');
  }
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    passwordErrors.push('Must contain at least 1 uppercase letter');
  }
  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    passwordErrors.push('Must contain at least 1 lowercase charater');
  }

  return passwordErrors;
};
