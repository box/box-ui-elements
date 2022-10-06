/**
 * @flow
 * @file Show more/less button
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../../components/plain-button';

import messages from './messages';

type Props = {
    isMore: boolean,
    onClick: Function,
};

const ToggleMoreLessButton = ({ onClick, isMore }: Props): React.Node => (
    <PlainButton className="bcs-ActivityMessage-toggleMoreLess" onClick={onClick}>
        <FormattedMessage {...(isMore ? messages.activityMessageSeeMore : messages.activityMessageSeeLess)} />
    </PlainButton>
);

export default ToggleMoreLessButton;
