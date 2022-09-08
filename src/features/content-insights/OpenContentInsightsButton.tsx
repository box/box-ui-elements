import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button, { ButtonType } from '../../components/button';

import messages from './messages';

interface Props {
    onClick: () => void;
}

const OpenContentInsightsButton = ({ onClick }: Props) => {
    return (
        <Button className="OpenContentInsightsButton" onClick={onClick} type={ButtonType.BUTTON}>
            <FormattedMessage {...messages.openContentInsightsButton} />
        </Button>
    );
};

export default OpenContentInsightsButton;
