import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {CopyToClipboard} from 'react-copy-to-clipboard';

interface Props {
  id: string;
  className?: string;
}

const {protocol, host} = window.location;
const prefix = `${protocol}//${host}/id/`;

const IdCopy = ({id, className = ''}: Props) => {
  return (
    <span
      className={`inline-flex bg-white rounded px-1.5 gap-1 align-text-bottom cursor-pointer ${className}`}
    >
      <img src="/permalink.svg" width="25" alt="Permalink" />
      <CopyToClipboard text={`${prefix}${id}`}>
        <span title="copy to clipboard">
          <span className="pr-1">{id}</span>
          <FontAwesomeIcon icon="clipboard" size="sm" />
        </span>
      </CopyToClipboard>
    </span>
  );
};

export default IdCopy;
