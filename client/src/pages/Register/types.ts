export interface RegisterState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  usernameAvailable: boolean | null;
  emailAvailable: boolean | null;
}

export interface RegisterProps {}
