/**
 * @flow
 * @file AddApproval component for ApprovalCommentForm component
 */

import React, { ReactNode } from 'react';

import Checkbox from 'box-react-ui/lib/components/checkbox/Checkbox';

import AddApprovalFields from './AddApprovalFields';
import messages from '../messages';
import type { Options, SelectorItems } from '../../../../flowTypes';

type Props = {
    approvalDate: number,
    approvers: Options,
    approverSelectorContacts: SelectorItems,
    approverSelectorError: string,
    formatMessage: Function,
    isAddApprovalVisible: boolean,
    onApprovalDateChange: Function,
    onApproverSelectorInput: Function,
    onApproverSelectorRemove: Function,
    onApproverSelectorSelect: Function
};

const AddApproval = ({
    approvalDate,
    approvers,
    approverSelectorContacts,
    approverSelectorError,
    formatMessage,
    isAddApprovalVisible,
    onApprovalDateChange,
    onApproverSelectorInput,
    onApproverSelectorRemove,
    onApproverSelectorSelect
}: Props): ReactNode => (
    <div className='comment-add-approver'>
        <Checkbox
            className='box-ui-comment-add-approver-checkbox'
            label={formatMessage(messages.approvalAddTask)}
            name='addApproval'
            isChecked={isAddApprovalVisible}
            tooltip={formatMessage(messages.approvalAddTaskTooltip)}
        />
        {isAddApprovalVisible ? (
            <AddApprovalFields
                approvalDate={approvalDate}
                approvers={approvers}
                approverSelectorContacts={approverSelectorContacts}
                approverSelectorError={approverSelectorError}
                formatMessage={formatMessage}
                onApproverSelectorInput={onApproverSelectorInput}
                onApproverSelectorRemove={onApproverSelectorRemove}
                onApproverSelectorSelect={onApproverSelectorSelect}
                onApprovalDateChange={onApprovalDateChange}
            />
        ) : null}
    </div>
);

export default AddApproval;
