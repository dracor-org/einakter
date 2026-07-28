import {createFileRoute} from '@tanstack/react-router';
import Id from '../../components/Id';

export const Route = createFileRoute('/id/$id')({
  component: Id,
});
