/**
 * @flow
 * @file Show Original button component used by Comment Text component
 */

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';

import messages from '../messages';

type Props = {
    handleShowOriginal: Function
};

const ShowOriginalButton = ({ handleShowOriginal }: Props): ReactNode => (
    <PlainButton className='bcs-comment-translate' onClick={handleShowOriginal}>
        <FormattedMessage {...messages.commentShowOriginal} />
    </PlainButton>
);

export default ShowOriginalButton;
