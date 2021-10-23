import {createContext} from 'react';
import {Play, OriginalPlay} from './types';
import plays from './data.json';
import originals from './originals.json';

interface Context {
  plays: Play[];
  originals: OriginalPlay[];
}

const context = {
  plays: plays as Play[],
  originals: originals as OriginalPlay[],
};

export const EinakterContext = createContext<Context>(context);
