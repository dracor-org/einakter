import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {useLocation} from 'react-router-dom';
import {useLingui} from "@lingui/react";
import {Trans} from '@lingui/macro';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {locales, setLocale} from '../i18n';

function Topnav () {
  const location = useLocation();
  const {i18n} = useLingui();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  }

  return (
    <Navbar className="flex p-4 bg-primary text-white uppercase font-medium" bg="dark" variant="dark" expand="lg" sticky="top">
      <Navbar.Brand href="/">
        <img
          src="/DONE.svg"
          width="170"
          alt="Einakter"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="flex flex-grow -ml-28">
        <Nav className="flex m-auto gap-8">
          <Nav.Link href="/about" active={isActive('/about')}>
            <Trans>About</Trans>
          </Nav.Link>
          <Nav.Link href="/locations" active={isActive('/locations')}>
            <Trans>Locations</Trans>
          </Nav.Link>
          <Nav.Link href="/originals" active={isActive('/originals')}>
            <Trans>Originals</Trans>
          </Nav.Link>
        </Nav>
        <Nav>
          {locales.map((locale) => (
            <span
              key={locale}
              style={{cursor: 'pointer'}}
              className={`nav-link${locale === i18n.locale ? ' active' : ''}`}
              onClick={() => setLocale(locale)}
            >
              {locale}
            </span>
          ))}
          <Nav.Link
            href="https://github.com/dracor-org/einakter"
            title="Einakter Github"
          >
            <FontAwesomeIcon className="scale-0 sm:scale-100" icon={faGithub} size="3x"/>
            <span className="block sm:hidden">Einakter Github</span>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Topnav;
