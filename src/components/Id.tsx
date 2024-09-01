import {useContext} from 'react';
import {useParams, Navigate} from 'react-router-dom';
import {EinakterContext} from '../context';

function Id() {
  const {id} = useParams<{id: string}>();
  const {plays, originals} = useContext(EinakterContext);

  const play = plays.find((p) => p.id === id);

  if (play) {
    return <Navigate to={`/${play.slug}`} />;
  }

  const original = originals.find((o) => o.id === id);

  if (original) {
    return <Navigate to={`/originals/${original.slug}`} />;
  }

  return (
    <div className="p-4">
      <h1>Not Found</h1>
    </div>
  );
}

export default Id;
