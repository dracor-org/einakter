import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Topnav from './components/Topnav';
import Table from './components/Table';
import Details from './components/Details';
import About from './components/About';
import Map from './components/Map';
import './icons';

import './App.css';

function App () {
  return (
    <Router>
      <Topnav/>
      <Container fluid>
        <Switch>
          <Route exact path="/">
            <Table/>
          </Route>
          <Route path="/about">
            <About/>
          </Route>
          <Route path="/map">
            <Map/>
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
