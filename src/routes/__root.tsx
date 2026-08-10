import {createRootRoute, Outlet} from '@tanstack/react-router';
import Topnav from '../components/Topnav';
import '../icons';
import '../App.scss';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Topnav />
      <Outlet />
    </>
  );
}
