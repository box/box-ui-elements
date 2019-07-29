/**
 * @flow
 * @file Show Original button component used by Comment Text component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../../components/plain-button';

import messages from './messages';

type Props = {
    handleShowOriginal: Function,
};

const ShowOriginalButton = ({ handleShowOriginal }: Props): React.Node => (
    <PlainButton className="bcs-ActivityMessage-translate" onClick={handleShowOriginal}>
        <FormattedMessage {...messages.activityMessageShowOriginal} />
    </PlainButton>
);

export default ShowOriginalButton;
