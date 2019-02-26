/**
 * @flow
 * @file Back Button component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import IconPageBack from '../../../icons/general/IconPageBack';
import messages from '../messages';
import PlainButton from '../../../components/plain-button';
import Tooltip from '../Tooltip';
import './BackButton.scss';

type Props = {
    history: RouterHistory,
};

const BackButton = ({ history }: Props) => (
    <Tooltip title={<FormattedMessage {...messages.back} />}>
        <PlainButton className="be-btn-back" onClick={() => history.goBack()} type="button">
            <IconPageBack />
        </PlainButton>
    </Tooltip>
);

export default withRouter(BackButton);
