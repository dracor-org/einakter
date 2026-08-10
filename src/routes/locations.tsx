import {createFileRoute} from '@tanstack/react-router';
import Map from '../components/Map';

export const Route = createFileRoute('/locations')({
  component: Map,
});
