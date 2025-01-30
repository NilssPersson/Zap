import { useLocation } from 'react-router-dom';
import SmallHeader from './SmallHeader';
import LargeHeader from './LargeHeader';

export function Header() {
  const location = useLocation();
  const locationPath = location.pathname;

  const inLobby = locationPath.endsWith('/lobby');
  const inGame = locationPath.startsWith('/play');
  const inEditor = locationPath.endsWith('/edit');

  if (inEditor || inLobby || inGame) {
    return null;
  }

  const isLargeScreen = window.innerWidth >= 1024;

  return isLargeScreen ? (
    <LargeHeader locationPath={locationPath} />
  ) : (
    <SmallHeader locationPath={locationPath} />
  );
}
