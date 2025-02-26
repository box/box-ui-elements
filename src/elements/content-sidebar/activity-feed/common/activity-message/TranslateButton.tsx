import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../../components/plain-button';
import messages from './messages';

export interface TranslateButtonProps {
    handleTranslate: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const TranslateButton = ({ handleTranslate }: TranslateButtonProps): React.ReactElement => (
    <PlainButton className="bcs-ActivityMessage-translate" onClick={handleTranslate}>
        <FormattedMessage {...messages.activityMessageTranslate} />
    </PlainButton>
);

export default TranslateButton;
