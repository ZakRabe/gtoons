export const goto = (history: any, path: string) => {
  return () => {
    if (path[0] === '/') {
      history.push(path);
    } else {
      window.open(path);
    }
  };
};
