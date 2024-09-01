import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Topnav from './components/Topnav';
import Home from './components/Home';
import Id from './components/Id';
import Plays from './components/Plays';
import Details from './components/Details';
import OriginalDetails from './components/OriginalDetails';
import About from './components/About';
import Map from './components/Map';
import Originals from './components/Originals';
import './icons';

import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Topnav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/id/:id" element={<Id />} />
        <Route path="/plays" element={<Plays />} />
        <Route path="/about" element={<About />} />
        <Route path="/locations" element={<Map />} />
        <Route path="/originals/:slug" element={<OriginalDetails />} />
        <Route path="/originals" element={<Originals />} />
        <Route path="/:slug" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
