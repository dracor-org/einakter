import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
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
    <Router>
      <Topnav/>
      <Container fluid>
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path="/plays">
            <Table/>
          </Route>
          <Route exact path="/map">
            <Redirect to="/locations" />
          </Route>
          <Route path="/about">
            <About/>
          </Route>
          <Route path="/locations">
            <Map/>
          </Route>
          <Route path="/originals/:originalId">
            <OriginalDetails/>
          </Route>
          <Route path="/originals">
            <Originals/>
          </Route>
          <Route path="/:id">
            <Details/>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
