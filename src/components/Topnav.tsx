import React, {ReactNode, useState} from 'react';
import {Link} from 'react-router-dom';
import {classnames, TTailwindString} from 'tailwindcss-classnames';
import {useLocation} from 'react-router-dom';
import {useLingui} from "@lingui/react";
import {Trans} from '@lingui/macro';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {faLanguage} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {locales, setLocale} from '../i18n';
import { Menu } from '@headlessui/react'

interface NavItemProps {
  href: string;
  children: ReactNode;
  className?: TTailwindString;
}

function NavItem ({href, className, children}: NavItemProps) {
  const location = useLocation();

  const isActive = location.pathname.startsWith(href);

  const classes = classnames(
    'block', 'mt-4', 'md:inline-block', 'md:mt-0', 'text-blue-100',
    'hover:text-white', 'mr-4', className,
    {italic: isActive}
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
      <div className="flex items-center flex-shrink-0 text-white">
        <a href="/" title="Einakter">
          <img src="/DONE.svg" width="170" alt="Einakter" />
        </a>
      </div>
      <div className="block md:hidden">
        <button
          className={classnames(
            "flex",
            "items-center",
            "px-3",
            "py-2",
            "border",
            "rounded",
            "hover:text-white",
            "hover:border-white"
          )}
          onClick={() => setShowNav(!showNav)}
        >
          <svg
            className="fill-current h-3 w-3"
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
          "uppercase",
          "w-full",
          "block",
          "flex-grow",
          "md:flex",
          "md:items-center",
          "md:w-auto",
          { hidden: !showNav }
        )}
      >
        <div className="mb-3 md:flex-grow md:mb-0 flex justify-center">
          <NavItem href="/about">
            <Trans>About</Trans>
          </NavItem>
          <NavItem href="/locations">
            <Trans>Locations</Trans>
          </NavItem>
          <NavItem href="/originals">
            <Trans>Originals</Trans>
          </NavItem>
        </div>
        <Menu>
          <Menu.Button className="relative justify-center inline-flex mr-8 hover:text-neutral-100">
            <FontAwesomeIcon
              className="scale-0 sm:scale-100"
              icon={faLanguage}
              size="2x"
            />
            <Menu.Items className="flex flex-col origin-top absolute top-6 mt-2 p-2.5 gap-2 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              {locales.map((locale) => (
                <Menu.Item>
                  {({ active }) => (
                    <button 
                      key={locale}
                      className={classnames(
                        "text-blue-900",
                        "uppercase",
                        "hover:text-blue-700",
                        "focus:text-blue-400",
                        {
                          "font-bold": locale === i18n.locale,
                          "text-blue-500": active = true,
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
          </Menu.Button>
        </Menu>
        <div>
          <a
            href="https://github.com/dracor-org/einakter"
            title="Einakter Github"
            className="text-white"
          >
            <FontAwesomeIcon
              className="scale-0 sm:scale-100"
              icon={faGithub}
              size="3x"
            />
            <span className="block sm:hidden">Einakter Github</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Topnav;
