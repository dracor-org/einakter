import {Fragment, ReactNode, useState, useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import {Trans} from '@lingui/macro';
import {faLanguage} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {locales, setLocale} from '../i18n';
import {Menu, Transition} from '@headlessui/react';
import {EinakterContext} from '../context';
import pkg from '../../package.json';

const version = import.meta.env.VITE_VERSION || pkg.version;

interface NavItemProps {
  href: string;
  children: ReactNode;
  className?: string;
}

function NavItem({href, className, children}: NavItemProps) {
  const {plays} = useContext(EinakterContext);
  const location = useLocation();

  const isActive =
    location.pathname.startsWith(href) ||
    Boolean(
      href === '/plays' && plays.find((p) => location.pathname === `/${p.slug}`)
    );

  const classes = `block mt-4 md:inline-block md:mt-1 text-white hover:text-blue-100 md:mr-6 ${className} ${isActive ? 'border-b-4' : ''} `;

  return (
    <Link to={href} className={classes}>
      {children}
    </Link>
  );
}

function Topnav() {
  const [showNav, setShowNav] = useState(false);
  const {i18n} = useLingui();

  return (
    <nav className="flex items-center justify-between flex-wrap p-4 bg-primary text-white font-medium">
      <div className="flex items-center flex-shrink-0 text-white hover:opacity-90">
        <a href="/" title={`Einakter ${version}`}>
          <img src="/Einakter.svg" width="170" alt="Einakter" />
        </a>
      </div>
      <div className="block md:hidden">
        <button
          className="flex items-center px-3 py-2 hover:text-blue-100"
          onClick={() => setShowNav(!showNav)}
        >
          <svg
            className="fill-current h-10 w-10"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className={`uppercase w-full block flex-grow md:flex md:items-center md:w-auto ${showNav ? '' : 'hidden'}`}
      >
        <div className="my-2 md:flex-grow md:flex-row flex justify-center flex-col">
          <NavItem href="/plays">
            <Trans>Plays</Trans>
          </NavItem>
          <NavItem href="/locations">
            <Trans>Locations</Trans>
          </NavItem>
          <NavItem href="/originals">
            <Trans>Originals</Trans>
          </NavItem>
          <NavItem href="/about">
            <Trans>About</Trans>
          </NavItem>
        </div>
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
        <div>
          <a
            href="https://github.com/dracor-org/einakter"
            title="Einakter Github"
            className="text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              width="50"
              height="50"
            >
              <path
                id="pfad"
                fill="#fff"
                d="M12,0C5.37,0,0,5.37,0,12c0,5.3,3.44,9.8,8.21,11.39C8.81,23.5,9,23.13,9,22.81v-2.23c-3.34,0.73-4.03-1.41-4.03-1.41
                c-0.55-1.39-1.33-1.76-1.33-1.76c-1.09-0.74,0.08-0.73,0.08-0.73c1.2,0.09,1.84,1.24,1.84,1.24c1.07,1.83,2.81,1.3,3.49,1
                c0.11-0.78,0.42-1.3,0.76-1.6c-1.72-0.19-3.49-0.69-4.53-2.25c-0.58-0.86-0.93-2.05-0.93-3.68c0-0.63,0.11-1.2,0.3-1.72
                c0.21-0.56,0.53-1.06,0.93-1.5C5.5,7.96,5.31,7.41,5.34,6.62c0.01-0.35,0.07-0.75,0.2-1.19c0.04-0.15,0.1-0.3,0.16-0.45
                c0,0,0.15-0.05,0.47-0.02c0.25,0.02,0.61,0.1,1.08,0.29C7.71,5.43,8.29,5.73,9,6.21c0.96-0.27,1.98-0.4,3-0.4
                c1.02,0,2.05,0.14,3.01,0.4c0.46-0.31,0.87-0.55,1.23-0.73c0.51-0.25,0.92-0.39,1.24-0.46c0.56-0.13,0.83-0.04,0.83-0.04
                c0.07,0.18,0.13,0.35,0.18,0.52c0.14,0.5,0.19,0.95,0.18,1.33c-0.01,0.68-0.17,1.15-0.24,1.32c0.38,0.42,0.69,0.9,0.91,1.43
                c0.21,0.54,0.33,1.13,0.33,1.79c0,1.44-0.27,2.53-0.73,3.36c-1.01,1.82-2.91,2.36-4.75,2.56c0.43,0.37,0.82,1.1,0.82,2.22
                c0,1.61,0,2.9,0,3.29c0,0.32,0.19,0.69,0.8,0.58C20.57,21.8,24,17.3,24,12C24,5.37,18.63,0,12,0z"
              >
                <animate
                  attributeName="d"
                  id="pfad"
                  begin="mouseover"
                  end="mouseleave"
                  fill="freeze"
                  dur="5s"
                  from="M12,0C5.37,0,0,5.37,0,12c0,5.3,3.44,9.8,8.21,11.39C8.81,23.5,9,23.13,9,22.81v-2.23c-3.34,0.73-4.03-1.41-4.03-1.41
                  c-0.55-1.39-1.33-1.76-1.33-1.76c-1.09-0.74,0.08-0.73,0.08-0.73c1.2,0.09,1.84,1.24,1.84,1.24c1.07,1.83,2.81,1.3,3.49,1
                  c0.11-0.78,0.42-1.3,0.76-1.6c-1.72-0.19-3.49-0.69-4.53-2.25c-0.58-0.86-0.93-2.05-0.93-3.68c0-0.63,0.11-1.2,0.3-1.72
                  c0.21-0.56,0.53-1.06,0.93-1.5C5.5,7.96,5.31,7.41,5.34,6.62c0.01-0.35,0.07-0.75,0.2-1.19c0.04-0.15,0.1-0.3,0.16-0.45
                  c0,0,0.15-0.05,0.47-0.02c0.25,0.02,0.61,0.1,1.08,0.29C7.71,5.43,8.29,5.73,9,6.21c0.96-0.27,1.98-0.4,3-0.4
                  c1.02,0,2.05,0.14,3.01,0.4c0.46-0.31,0.87-0.55,1.23-0.73c0.51-0.25,0.92-0.39,1.24-0.46c0.56-0.13,0.83-0.04,0.83-0.04
                  c0.07,0.18,0.13,0.35,0.18,0.52c0.14,0.5,0.19,0.95,0.18,1.33c-0.01,0.68-0.17,1.15-0.24,1.32c0.38,0.42,0.69,0.9,0.91,1.43
                  c0.21,0.54,0.33,1.13,0.33,1.79c0,1.44-0.27,2.53-0.73,3.36c-1.01,1.82-2.91,2.36-4.75,2.56c0.43,0.37,0.82,1.1,0.82,2.22
                  c0,1.61,0,2.9,0,3.29c0,0.32,0.19,0.69,0.8,0.58C20.57,21.8,24,17.3,24,12C24,5.37,18.63,0,12,0z"
                  to="M12,0C5.37,0,0,5.37,0,12c0,5.3,3.52,8.88,5.08,9.81c0.51,0.33,0.64,0.29,1.05,0.27v-0.31c0.04-0.6,0.36-1.03,0.36-1.03
                  c0.14-0.28,0.26-0.41,0.26-0.41c0.06-0.08,0.11-0.16,0.11-0.16c0.15-0.2,0.34-0.42,0.34-0.42c0.2-0.22,0.22-0.24,0.56-0.53
                  c0.12-0.13,0.22-0.19,0.54-0.44c-1.54-0.92-1.58-2.25-1.56-2.68c0.07-1.43,0.95-2.01,1.19-2.23c0.04-0.03,0.33-1.19,0.48-1.72
                  c0.17-0.65,0.23-0.91,0.52-1.37C8.57,10.37,7.78,9.56,6.9,7.26C6.37,5.89,6.24,4,6.4,2.98c0.02-0.11,0.05-0.16,0.12-0.21
                  c0,0,0.1-0.11,0.25-0.02c0.64,0.39,1.88,1.71,2.54,2.83c0.49,0.84,1.1,2.21,1.34,3.75c0.7-0.23,0.9-0.26,1.46-0.26
                  c0.51,0,0.64,0.03,1.24,0.26c0.16-1.17,0.9-3.19,1.42-3.88c0.44-0.59,1.25-1.85,2.4-2.65c0.13-0.09,0.26-0.03,0.26-0.03
                  c0.07,0.03,0.15,0.04,0.17,0.21c0.22,1.68-0.17,3.21-0.28,3.58c-0.84,2.85-2.19,4.05-2.26,4.22c0.34,0.52,0.36,1.02,0.57,1.55
                  c0.21,0.54,0.31,1.48,0.43,1.54c0.24,0.12,1.39,1.51,1.18,2.54c-0.25,1.23-0.43,1.65-1.55,2.37c0.43,0.37,0.98,0.65,1.52,1.47
                  c0.88,1.34,0.57,1.18,0.82,1.49c0.34,0.41,0.8,0.23,0.94,0.03C20.66,20.6,24,17.3,24,12C24,5.37,18.63,0,12,0z"
                />
              </path>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Topnav;
