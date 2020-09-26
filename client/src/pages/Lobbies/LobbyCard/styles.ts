export const TileStyles: React.CSSProperties = {
  maxHeight: '17rem',
  maxWidth: '20rem',
  padding: 0,
};

export const TileBodyStyles: React.CSSProperties = {
  padding: '1rem 2rem',
};

export const TileHeadStyles: React.CSSProperties = {
  padding: '0.5rem 1rem 0rem 1rem',
  display: 'flex',
};

export const TileHeadCloseContainerStyles: React.CSSProperties = {
  display: 'flex',
  flex: '1 0 auto',
  justifyContent: 'end',
};

export const TileHeadCloseStyles: React.CSSProperties = {
  background: 'none',
  padding: 0,
  color: '#161616',
  minHeight: '0.5rem',
  alignSelf: 'flex-start',
};

export const TilePictureStyles: React.CSSProperties = {
  borderRadius: '1.5rem',
  marginRight: '0.625rem',
};

export const TileTitleStyles: React.CSSProperties = {
  color: '#416B81',
  margin: 0,
  font: 'normal normal normal 1.25rem/1.375rem Archivo Black',
};

export const TileSubtitleStyles: React.CSSProperties = {
  font: 'normal normal normal 0.75rem/1rem Roboto',
  color: '#525252',
};

const ButtonBase: React.CSSProperties = {
  width: '100%',
  maxHeight: '3rem',
  minHeight: '1.5rem',
};

export const ButtonStylesActive: React.CSSProperties = {
  ...ButtonBase,
  backgroundColor: '#699DE6',
  color: 'white',
};

export const ButtonStylesDisabled: React.CSSProperties = {
  ...ButtonBase,
  color: '#161616',
};

export const LobbyDetailHeaderStyles: React.CSSProperties = {
  display: 'flex',
  color: '#9BA2A7',
  font: 'normal normal normal 0.625rem/0.8125rem Roboto',
};

export const LobbyDetailContentStyles: React.CSSProperties = {
  color: '#495D71',
  marginLeft: '0.75rem',
  font: 'normal normal normal 0.8125rem/1.25rem Roboto',
};
