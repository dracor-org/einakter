import React, {ReactNode, useState} from 'react';
import { Fragment } from 'react';
import {Link} from 'react-router-dom';
import {classnames, TTailwindString} from 'tailwindcss-classnames';
import {useLocation} from 'react-router-dom';
import {useLingui} from "@lingui/react";
import {Trans} from '@lingui/macro';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {faLanguage} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {locales, setLocale} from '../i18n';
import { Menu, Transition } from '@headlessui/react'

interface NavItemProps {
  href: string;
  children: ReactNode;
  className?: TTailwindString;
}

function NavItem ({href, className, children}: NavItemProps) {
  const location = useLocation();

  const isActive = location.pathname.startsWith(href);

  const classes = classnames(
    'block', 'mt-4', 'md:inline-block', 'md:mt-0', 'text-white',
    'hover:text-blue-100', 'mr-6', className,
    {block: isActive}
  );

  return (
    <Link to={href} className={classes}>{children}</Link>
  );
}

function Topnav () {
  const [showNav, setShowNav] = useState(false);
  const {i18n} = useLingui();

  return (
    <nav className="flex items-center justify-between flex-wrap p-4 bg-primary text-white font-medium">
      <div className="flex items-center flex-shrink-0 text-white hover:opacity-90">
        <a href="/" title="Einakter">
          <img src="/DONE.svg" width="170" alt="Einakter" />
        </a>
      </div>
      <div className="block md:hidden">
        <button
          className={classnames(
            'flex',
            'items-center',
            'px-3',
            'py-2',
            'hover:text-blue-100'
          )}
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
        className={classnames(
          'uppercase',
          'w-full',
          'block',
          'flex-grow',
          'md:flex',
          'md:items-center',
          'md:w-auto',
          { hidden: !showNav }
        )}
      >
        <div className="my-3 md:flex-grow md:flex-row flex justify-center flex-col">
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
            <FontAwesomeIcon
              icon={faLanguage}
              size="2x"
            />
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="flex flex-col origin-top absolute top-6 mt-2 p-2.5 gap-2 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {locales.map((locale) => (
                  <Menu.Item key={locale}>
                    {({ active }) => (
                      <button 
                        key={locale}
                        className={classnames(
                          'text-blue-900',
                          'uppercase',
                          'hover:text-blue-700',
                          'focus:text-blue-400',
                          {
                            'font-bold': locale === i18n.locale,
                            'text-blue-500': active,
                          }
                          
                        )}
                        onClick={() => setLocale(locale)}
                      >
                        {locale}
                      </button>
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
            <FontAwesomeIcon
              className="scale-90 -ml-1 -mb-1 sm:m-0 sm:scale-100 hover:text-neutral-100"
              icon={faGithub}
              size="3x"
            />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Topnav;
