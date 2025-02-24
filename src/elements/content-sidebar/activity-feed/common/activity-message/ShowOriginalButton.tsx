import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../../components/plain-button';
import messages from './messages';

export interface ShowOriginalButtonProps {
    handleShowOriginal: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const ShowOriginalButton = ({ handleShowOriginal }: ShowOriginalButtonProps): React.ReactElement => (
    <PlainButton className="bcs-ActivityMessage-translate" onClick={handleShowOriginal}>
        <FormattedMessage {...messages.activityMessageShowOriginal} />
    </PlainButton>
);

export default ShowOriginalButton;
