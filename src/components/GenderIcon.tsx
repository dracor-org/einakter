import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {t} from '@lingui/core/macro';

interface Props {
  gender: string;
}

const GenderIcon = ({gender}: Props) => {
  if (gender === 'f') {
    return <FontAwesomeIcon icon="venus" title={t`female`} />;
  }
  if (gender === 'm') {
    return <FontAwesomeIcon icon="mars" title={t`male`} />;
  }
  return <i />;
};

export default GenderIcon;
