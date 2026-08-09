import {Fragment, useContext} from 'react';
import {useLingui} from '@lingui/react';
import {t} from '@lingui/core/macro';
import {faLanguage} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Menu, Transition} from '@headlessui/react';
import {useLocation} from '@tanstack/react-router';
import {NavBar} from '@dracor/react';
import {EinakterContext} from '../context';
import {locales, setLocale} from '../i18n';
import pkg from '../../package.json';

const version = import.meta.env.VITE_VERSION || pkg.version;

function LanguageMenu() {
  const {i18n} = useLingui();
  return (
    <Menu>
      <Menu.Button className="relative justify-center inline-flex mr-8 hover:text-neutral-100">
        <FontAwesomeIcon icon={faLanguage} size="2x" />
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="flex flex-col origin-top absolute top-6 mt-2 p-2.5 gap-2 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            {locales.map((locale) => (
              <Menu.Item key={locale}>
                {({active}) => (
                  <span
                    key={locale}
                    className={`${locale === i18n.locale ? 'font-bold' : 'font-normal'} ${active ? 'text-blue-500' : 'text-blue-900'} uppercase hover:text-blue-700 focus:text-blue-400`}
                    onClick={() => setLocale(locale)}
                  >
                    {locale}
                  </span>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu.Button>
    </Menu>
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
      addItem={<LanguageMenu />}
    />
  );
}
