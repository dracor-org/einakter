import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Topnav from './components/Topnav';
import Home from './components/Home';
import Table from './components/Table';
import Details from './components/Details';
import OriginalDetails from './components/OriginalDetails';
import About from './components/About';
import Map from './components/Map';
import Originals from './components/Originals';
import './icons';

import './App.scss';

function App () {
  return (
    <BrowserRouter>
      <Topnav/>
      <Container fluid>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/plays" element={<Table/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/locations" element={<Map/>} />
          <Route path="/originals/:originalId" element={<OriginalDetails/>} />
          <Route path="/originals" element={<Originals/>} />
          <Route path="/:id" element={<Details/>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
