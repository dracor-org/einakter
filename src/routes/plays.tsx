import {createFileRoute} from '@tanstack/react-router';
import Plays from '../components/Plays';

export const Route = createFileRoute('/plays')({
  component: Plays,
});
