import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import LabelPill, { LabelPillStatus } from '../../../../../components/label-pill';
import { COMMENT_STATUS_RESOLVED } from '../../../../../constants';
import messages from './messages';
import { FeedItemStatus } from '../../../../../common/types/feed';
import './ActivityStatus.scss';

export interface ActivityStatusProps {
    status?: FeedItemStatus;
}

const ActivityStatus = ({ status }: ActivityStatusProps) => {
    if (status !== COMMENT_STATUS_RESOLVED) {
        return null;
    }

    return (
        <div className="bcs-ActivityStatus">
            <LabelPill.Pill type={LabelPillStatus.SUCCESS}>
                <LabelPill.Text>
                    <FormattedMessage {...messages.activityStatusResolved} />
                </LabelPill.Text>
            </LabelPill.Pill>
        </div>
    );
};

export default ActivityStatus;
