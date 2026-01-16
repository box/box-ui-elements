import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button as BlueprintButton } from '@box/blueprint-web';
import Button, { ButtonType } from '../../components/button';

import messages from './messages';

interface Props {
    onClick: () => void;
    isRedesignEnabled?: boolean;
}

const OpenContentInsightsButton = ({ onClick, isRedesignEnabled }: Props) => {
    const { formatMessage } = useIntl();

    if (isRedesignEnabled) {
        return (
            <BlueprintButton className="OpenContentInsightsButton" onClick={onClick} type="button" variant="primary">
                {formatMessage(messages.openContentInsightsButton)}
            </BlueprintButton>
        );
    }

    return (
        <Button className="OpenContentInsightsButton" onClick={onClick} type={ButtonType.BUTTON}>
            <FormattedMessage {...messages.openContentInsightsButton} />
        </Button>
    );
};

export default OpenContentInsightsButton;
