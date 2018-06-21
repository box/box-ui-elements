/**
 * @flow
 * @file AddApproval component for ApprovalCommentForm component
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';

import Checkbox from 'box-react-ui/lib/components/checkbox/Checkbox';

import AddApprovalFields from './AddApprovalFields';
import messages from '../../../messages';

type Props = {
    approvalDate: ?Date,
    approvers: SelectorItems,
    approverSelectorContacts?: SelectorItems,
    approverSelectorError: string,
    isAddApprovalVisible: boolean,
    onApprovalDateChange: Function,
    onApproverSelectorInput: Function,
    onApproverSelectorRemove: Function,
    onApproverSelectorSelect: Function,
    intl: any
};

const AddApproval = ({
    approvalDate,
    approvers,
    approverSelectorContacts,
    approverSelectorError,
    isAddApprovalVisible,
    onApprovalDateChange,
    onApproverSelectorInput,
    onApproverSelectorRemove,
    onApproverSelectorSelect,
    intl
}: Props): React.Node => (
    <div className='bcs-comment-add-approver'>
        <Checkbox
            className='bcs-comment-add-approver-checkbox'
            label={intl.formatMessage(messages.approvalAddTask)}
            name='addApproval'
            isChecked={isAddApprovalVisible}
            tooltip={intl.formatMessage(messages.approvalAddTaskTooltip)}
        />
        {isAddApprovalVisible ? (
            <AddApprovalFields
                approvalDate={approvalDate}
                approvers={approvers}
                approverSelectorContacts={approverSelectorContacts}
                approverSelectorError={approverSelectorError}
                onApproverSelectorInput={onApproverSelectorInput}
                onApproverSelectorRemove={onApproverSelectorRemove}
                onApproverSelectorSelect={onApproverSelectorSelect}
                onApprovalDateChange={onApprovalDateChange}
            />
        ) : null}
    </div>
);

export default injectIntl(AddApproval);
