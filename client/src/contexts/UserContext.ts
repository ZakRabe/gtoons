import * as React from 'react';

export const UserContext = React.createContext({
  user: (null as unknown) as { userId: number; username: string } | null,
  setUser: (() => {}) as any,
});
export default UserContext;
