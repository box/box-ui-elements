// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'box-ui-elements/es/components/button';

import messages from './messages';

type Props = {
    onClick: Function,
};

const OpenContentInsightsButton = ({ onClick }: Props) => {
    return (
        <Button className="OpenContentInsightsButton" onClick={onClick} type="button">
            <FormattedMessage {...messages.openContentInsightsButton} />
        </Button>
    );
};

export default OpenContentInsightsButton;
