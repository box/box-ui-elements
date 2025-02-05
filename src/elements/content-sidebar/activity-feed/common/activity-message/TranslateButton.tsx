import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../../components/plain-button';
import { ButtonType } from '../../../../../components/button';

import messages from './messages';

interface Props {
    handleTranslate: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const TranslateButton = ({ handleTranslate }: Props): React.ReactElement => (
    <PlainButton className="bcs-ActivityMessage-translate" onClick={handleTranslate} type={ButtonType.BUTTON}>
        <FormattedMessage {...messages.activityMessageTranslate} />
    </PlainButton>
);

export default TranslateButton;
