/**
 * @flow
 * @file Comment Input Controls components for CommentForm
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
    <div className="bcs-CommentFormControls">
        <Button data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL} onClick={onCancel} type="button">
            <FormattedMessage {...messages.commentCancel} />
        </Button>
        <PrimaryButton data-resin-target={ACTIVITY_TARGETS.APPROVAL_FORM_POST}>
            <FormattedMessage {...messages.commentPost} />
        </PrimaryButton>
    </div>
);

export default CommentInputControls;
