import {useContext} from 'react';
import {Navigate} from '@tanstack/react-router';
import {Route} from '../routes/id/$id';
import {EinakterContext} from '../context';

function Id() {
  const {id} = Route.useParams();
  const {plays, originals} = useContext(EinakterContext);

  const play = plays.find((p) => p.id === id);

  if (play) {
    return <Navigate to="/$slug" params={{slug: play.slug}} />;
  }

  const original = originals.find((o) => o.id === id);

  if (original) {
    return <Navigate to="/originals/$slug" params={{slug: original.slug}} />;
  }

  return (
    <div className="p-4">
      <h1>Not Found</h1>
    </div>
  );
}

export default Id;
