/**
 * @flow
 * @file Comment Input Controls components for ApprovalCommentForm
 */

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'box-react-ui/lib/components/button/Button';
import PrimaryButton from 'box-react-ui/lib/components/primary-button/PrimaryButton';

import messages from '../messages';

type Props = {
    onCancel: Function
};

const CommentInputControls = ({ onCancel }: Props): ReactNode => (
    <div className='bcs-comment-input-controls'>
        <Button className='bcs-comment-input-cancel-btn' onClick={onCancel} type='button'>
            <FormattedMessage {...messages.commentCancel} />
        </Button>
        <PrimaryButton className='bcs-comment-input-submit-btn'>
            <FormattedMessage {...messages.commentPost} />
        </PrimaryButton>
    </div>
);

export default CommentInputControls;
