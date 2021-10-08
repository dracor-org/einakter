import {createContext} from 'react';
import plays from './data.json';
import originals from './originals.json';

export const EinakterContext = createContext({plays, originals});
