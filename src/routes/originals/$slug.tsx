import {createFileRoute} from '@tanstack/react-router';
import OriginalDetails from '../../components/OriginalDetails';

export const Route = createFileRoute('/originals/$slug')({
  component: OriginalDetails,
});
