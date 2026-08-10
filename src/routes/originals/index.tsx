import {createFileRoute} from '@tanstack/react-router';
import Originals from '../../components/Originals';

export const Route = createFileRoute('/originals/')({
  component: Originals,
});
