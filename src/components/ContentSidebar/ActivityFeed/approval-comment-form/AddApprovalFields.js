/**
 * @flow
 * @file Add Approval Fields component for ApprovalComment component
 */

import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import ContactDatalistItem from 'box-react-ui/lib/components/contact-datalist-item/ContactDatalistItem';
import DatePicker from 'box-react-ui/lib/components/date-picker/DatePicker';
import PillSelectorDropdown from 'box-react-ui/lib/components/pill-selector-dropdown/PillSelectorDropdown';

import type { SelectorItems } from '../../../../flowTypes';
import messages from '../../../messages';

type Props = {
    approvalDate: ?number,
    approvers: SelectorItems,
    approverSelectorContacts: SelectorItems,
    approverSelectorError: string,
    formatMessage: Function,
    onApprovalDateChange: Function,
    onApproverSelectorInput: Function,
    onApproverSelectorRemove: Function,
    onApproverSelectorSelect: Function,
    intl: any
};

const AddApprovalFields = ({
    approvalDate,
    approvers,
    approverSelectorContacts = [],
    approverSelectorError,
    onApprovalDateChange,
    onApproverSelectorInput,
    onApproverSelectorRemove,
    onApproverSelectorSelect,
    intl
}: Props): React.Node => {
    const approverOptions = approverSelectorContacts
        // filter selected approvers
        .filter(({ id }) => !approvers.find(({ value }) => value === id))
        // map to datalist item format
        .map(({ id, item }) => ({
            login: item.login,
            text: item.name,
            value: id
        }));

    return (
        <div className='bcs-comment-add-approver-fields-container'>
            <PillSelectorDropdown
                error={approverSelectorError}
                label={<FormattedMessage {...messages.approvalAssignees} />}
                onInput={onApproverSelectorInput}
                onRemove={onApproverSelectorRemove}
                onSelect={onApproverSelectorSelect}
                placeholder={intl.formatMessage(messages.approvalAddAssignee)}
                selectedOptions={approvers}
                selectorOptions={approverOptions}
            >
                {approverOptions.map(({ login, text, value }) => (
                    <ContactDatalistItem key={value} name={text} subtitle={login} />
                ))}
            </PillSelectorDropdown>
            <DatePicker
                className='bcs-comment-add-approver-date-input'
                label={<FormattedMessage {...messages.approvalDueDate} />}
                minDate={new Date()}
                name='approverDateInput'
                placeholder={intl.formatMessage(messages.approvalSelectDate)}
                onChange={onApprovalDateChange}
                value={approvalDate}
            />
        </div>
    );
};

export default injectIntl(AddApprovalFields);
