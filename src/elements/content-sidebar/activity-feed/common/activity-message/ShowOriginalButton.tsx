import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../../components/plain-button';
import { ButtonType } from '../../../../../components/button';

import messages from './messages';

interface Props {
    handleShowOriginal: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const ShowOriginalButton = ({ handleShowOriginal }: Props): React.ReactElement => (
    <PlainButton className="bcs-ActivityMessage-translate" onClick={handleShowOriginal} type={ButtonType.BUTTON}>
        <FormattedMessage {...messages.activityMessageShowOriginal} />
    </PlainButton>
);

export default ShowOriginalButton;
