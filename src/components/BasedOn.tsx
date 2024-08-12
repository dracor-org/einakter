import ReactMarkdown from 'react-markdown';
import Original from './Original';
import {OriginalPlay} from '../types';

interface Props {
  refs: (string | OriginalPlay)[];
}

const BasedOn = ({refs}: Props) => {
  return (
    <ul>
      {refs.map((ref) =>
        typeof ref === 'string' ? (
          <li key={ref}>
            <ReactMarkdown>{ref}</ReactMarkdown>
          </li>
        ) : (
          <li key={ref.id}>
            <Original data={ref} />
          </li>
        )
      )}
    </ul>
  );
};

export default BasedOn;
