/**
 * @flow
 * @file Translate button component used by Comment Text component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../../components/plain-button';

import messages from './messages';

type Props = {
    handleTranslate: Function,
};

const TranslateButton = ({ handleTranslate }: Props): React.Node => (
    <PlainButton className="bcs-ActivityMessage-translate" onClick={handleTranslate}>
        <FormattedMessage {...messages.activityMessageTranslate} />
    </PlainButton>
);

export default TranslateButton;
