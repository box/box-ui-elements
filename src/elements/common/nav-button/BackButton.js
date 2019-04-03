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
    path?: string,
};

const BackButton = ({ history, path }: Props) => (
    <PlainButton
        className="bdl-BackButton"
        onClick={() => (path ? history.push(path) : history.goBack())}
        type="button"
    >
        <IconNavigateLeft height={24} width={24} />
        <span className="accessibility-hidden">
            <FormattedMessage {...messages.back} />
        </span>
    </PlainButton>
);

export default withRouter(BackButton);
