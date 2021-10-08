import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useLocation } from 'react-router-dom';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function Topnav () {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Navbar.Brand href="/">Einakter</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/about" active={isActive('/about')}>
            About
          </Nav.Link>
          <Nav.Link href="/locations" active={isActive('/locations')}>
            Locations
          </Nav.Link>
          <Nav.Link href="/originals" active={isActive('/originals')}>
            Originals
          </Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <Nav.Link
            href="https://github.com/dracor-org/einakter"
            title="Einakter Github"
          >
            <FontAwesomeIcon icon={faGithub} size="lg"/>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Topnav;
