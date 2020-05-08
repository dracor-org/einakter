import React from 'react';
import Container from 'react-bootstrap/Container';
import Topnav from './components/Topnav';
import Table from './components/Table';

import './App.css';

function App () {
  return (
    <>
      <Topnav/>
      <Container fluid>
        <Table/>
      </Container>
    </>
  );
}

export default App;
