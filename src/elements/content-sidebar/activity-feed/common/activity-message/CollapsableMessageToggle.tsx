import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../../components/plain-button';
import { ButtonType } from '../../../../../components/button';

import messages from './messages';

interface Props {
    isMore: boolean;
    onClick: () => void;
}

const CollapsableMessageToggle = ({ isMore, onClick }: Props): React.ReactElement => (
    <PlainButton className="bcs-ActivityMessage-toggleMoreLess" onClick={onClick} type={ButtonType.BUTTON}>
        <FormattedMessage {...(isMore ? messages.activityMessageSeeMore : messages.activityMessageSeeLess)} />
    </PlainButton>
);

export default CollapsableMessageToggle;
