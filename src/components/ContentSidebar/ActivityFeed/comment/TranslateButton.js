/**
 * @flow
 * @file Translate button component used by Comment Text component
 */
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';

import messages from '../../../messages';

type Props = {
    handleTranslate: Function
};

const TranslateButton = ({ handleTranslate }: Props): ReactNode => (
    <PlainButton className='bcs-comment-translate' onClick={handleTranslate}>
        <FormattedMessage {...messages.commentTranslate} />
    </PlainButton>
);

export default TranslateButton;
