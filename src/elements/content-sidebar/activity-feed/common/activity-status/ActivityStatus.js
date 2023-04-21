// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import LabelPill from '../../../../../components/label-pill';
import { COMMENT_STATUS_RESOLVED } from '../../../../../constants';
import messages from './messages';
import type { FeedItemStatus } from '../../../../../common/types/feed';
import './ActivityStatus.scss';

type Props = {
    status?: FeedItemStatus,
};

const ActivityStatus = ({ status }: Props): React.Node => {
    if (status !== COMMENT_STATUS_RESOLVED) {
        return null;
    }

    return (
        <div className="bcs-ActivityStatus" data-testid="bcs-ActivityStatus">
            <LabelPill.Pill type="success">
                <LabelPill.Text>
                    <FormattedMessage {...messages.activityStatusResolved} />
                </LabelPill.Text>
            </LabelPill.Pill>
        </div>
    );
};

export default ActivityStatus;
