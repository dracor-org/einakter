import {useContext} from 'react';
import {useLingui} from '@lingui/react';
import {t} from '@lingui/core/macro';
import {useLocation} from '@tanstack/react-router';
import {LanguageMenu, NavBar} from '@dracor/react';
import {EinakterContext} from '../context';
import {locales, setLocale} from '../i18n';
import pkg from '../../package.json';

const version = import.meta.env.VITE_VERSION || pkg.version;

function EinakterLanguageMenu() {
  const {i18n} = useLingui();
  return (
    <LanguageMenu
      languages={locales}
      current={i18n.locale}
      onSelect={setLocale}
    />
  );
}

export default function Topnav() {
  // Subscribe to locale changes so nav item labels re-translate. The `t`
  // macro alone reads the global i18n at render time — without this hook the
  // component doesn't re-render when the language menu switches locale.
  useLingui();
  // Play detail pages live under the /$slug catch-all; keep "Plays" visually
  // active while browsing them by injecting the border-b class the library
  // NavItem otherwise only applies on an exact route match.
  const {pathname} = useLocation();
  const {plays} = useContext(EinakterContext);
  const onPlayDetail = plays.some((p) => pathname === `/${p.slug}`);
  return (
    <NavBar
      title="Einakter"
      logo="/Einakter.svg"
      logoClass="w-[170px] h-auto"
      version={version}
      gitHubUrl="https://github.com/dracor-org/einakter"
      navItems={[
        {
          label: t`Plays`,
          to: '/plays',
          className: onPlayDetail ? 'border-b-4' : '',
        },
        {label: t`Locations`, to: '/locations'},
        {label: t`Originals`, to: '/originals'},
        {label: t`About`, to: '/about'},
      ]}
      addItem={<EinakterLanguageMenu />}
    />
  );
}
