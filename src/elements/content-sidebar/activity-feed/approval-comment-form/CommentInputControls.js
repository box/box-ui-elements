/**
 * @flow
 * @file Comment Input Controls components for ApprovalCommentForm
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';

import messages from './messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';

type Props = {
    onCancel: Function,
};

const CommentInputControls = ({ onCancel }: Props): React.Node => (
    <div className="bcs-comment-input-controls">
        <Button
            className="bcs-comment-input-cancel-btn"
            data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL}
            onClick={onCancel}
            type="button"
        >
            <FormattedMessage {...messages.commentCancel} />
        </Button>
        <PrimaryButton className="bcs-comment-input-submit-btn" data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_POST}>
            <FormattedMessage {...messages.commentPost} />
        </PrimaryButton>
    </div>
);

export default CommentInputControls;
