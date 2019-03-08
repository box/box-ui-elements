/**
 * @flow
 * @file Back Button component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import IconNavigateLeft from '../../../icons/general/IconNavigateLeft';
import messages from '../messages';
import PlainButton from '../../../components/plain-button';
import './BackButton.scss';

type Props = {
    history: RouterHistory,
};

const BackButton = ({ history }: Props) => (
    <PlainButton className="be-btn-back" onClick={() => history.goBack()} type="button">
        <IconNavigateLeft height={24} width={24} />
        <FormattedMessage {...messages.back}>
            {content => <span className="accessibility-hidden">{content}</span>}
        </FormattedMessage>
    </PlainButton>
);

export default withRouter(BackButton);
