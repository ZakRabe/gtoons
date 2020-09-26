export const newGame: React.CSSProperties = {
  background: `transparent
    linear-gradient(
      85deg,
      rgba(105, 157, 230, 0.25) 0%,
      rgba(92, 137, 201, 0.25) 100%
    )
    0% 0% no-repeat padding-box`,
};

export const newGameContent: React.CSSProperties = {
  color: 'white',
  display: 'flex',
  justifyContent: 'end',
  padding: '2rem 1.5rem',
};

export const newGameContentAction: React.CSSProperties = {
  marginRight: 'auto',
};

export const lobbieContent: React.CSSProperties = {
  padding: '2rem 1.5rem',
  color: 'white',
};

export const createLobby: React.CSSProperties = {
  background: 'var(--lobbies-background)',
};

export const profileContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  maxWidth: '256px' /* I should probably be using rem here because safari */,
  maxHeight: '256px',
};
