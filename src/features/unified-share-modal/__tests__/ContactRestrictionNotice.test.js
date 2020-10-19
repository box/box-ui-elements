// @flow
import React from 'react';
import { shallow } from 'enzyme';

import { ContactRestrictionNoticeComponent as ContactRestrictionNotice } from '../ContactRestrictionNotice';

describe('features/unified-share-modal/ContactRestrictionNotice', () => {
    let wrapper;
    let selectedContacts;
    let restrictedExternalEmails;

    const singularMessageId = 'boxui.unifiedShare.businessJustificationRequiredSingular';
    const pluralMessageId = 'boxui.unifiedShare.businessJustificationRequiredPlural';

    const getWrapper = (props = {}) => {
        return shallow(
            <ContactRestrictionNotice
                error=""
                isLoading={false}
                intl={{ formatMessage: jest.fn() }}
                justificationReasons={[]}
                onRemoveRestrictedExternalContacts={jest.fn()}
                onSelectJustificationReason={jest.fn()}
                restrictedExternalEmails={restrictedExternalEmails}
                selectedContacts={selectedContacts}
                selectedJustificationReason={null}
                {...props}
            />,
        );
    };

    beforeEach(() => {
        selectedContacts = [
            {
                email: 'x@example.com',
                id: '12345',
                text: 'X User',
                type: 'group',
                value: 'x@example.com',
            },
            {
                email: 'y@example.com',
                id: '23456',
                text: 'Y User',
                type: 'user',
                value: 'y@example.com',
            },
            {
                email: 'z@example.com',
                id: '34567',
                text: 'Z User',
                type: 'user',
                value: 'z@example.com',
            },
        ];
        restrictedExternalEmails = ['x@example.com', 'y@example.com'];

        wrapper = getWrapper();
    });

    describe('render', () => {
        test('should render default ContactRestrictionNotice component', () => {
            expect(wrapper.is('InlineNotice')).toBe(true);
            expect(wrapper.find(`FormattedCompMessage[id="${pluralMessageId}"]`)).toHaveLength(1);
            expect(wrapper.find('[data-resin-target="justificationReasonsSelect"]')).toHaveLength(1);
        });

        test('should render nothing when there are no restricted external contacts', () => {
            wrapper.setProps({ restrictedExternalEmails: [], selectedContacts });
            expect(wrapper.isEmptyRender()).toBe(true);

            wrapper.setProps({ restrictedExternalEmails, selectedContacts: [] });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        test('should render singular message when only one restricted external contact exists', () => {
            restrictedExternalEmails = ['x@example.com'];

            wrapper.setProps({ restrictedExternalEmails });
            const message = wrapper.find(`FormattedCompMessage[id="${singularMessageId}"]`);
            expect(message).toHaveLength(1);
        });

        test('should render plural message when more than one restricted external contact exist', () => {
            restrictedExternalEmails = ['x@example.com', 'y@example.com', 'z@example.com'];

            wrapper.setProps({ restrictedExternalEmails });
            const message = wrapper.find(`FormattedCompMessage[id="${pluralMessageId}"]`);
            expect(message).toHaveLength(1);
        });

        test('should pass contacts information to tooltip within message', () => {
            const expectedContacts = selectedContacts.filter(({ value }) => restrictedExternalEmails.includes(value));
            const message = wrapper.find(`FormattedCompMessage[id="${pluralMessageId}"]`);

            expect(message.find('ContactsEmailsTooltip').props().contacts).toEqual(expectedContacts);
            expect(
                message
                    .find('ContactsEmailsTooltip')
                    .find('Param')
                    .props().value,
            ).toBe(expectedContacts.length);
        });

        test('should render a loading indicator instead of the justification reasons select when isLoading is true', () => {
            wrapper.setProps({ isLoading: true });

            expect(wrapper.find('[data-resin-target="justificationReasonsSelect"]')).toHaveLength(0);
            expect(wrapper.find('LoadingIndicator')).toHaveLength(1);
        });

        test('should pass error to justification reasons select when provided', () => {
            const error = 'error';
            wrapper.setProps({ error, isLoading: false });

            expect(wrapper.find('[data-resin-target="justificationReasonsSelect"]').props().error).toBe(error);
        });

        test('should render justification reasons select when isLoading is false', () => {
            const selectedJustificationReason = {
                displayText: 'displayText1',
                value: 'value1',
            };
            const justificationReasons = [
                selectedJustificationReason,
                {
                    displayText: 'displayText2',
                    value: 'value2',
                },
            ];
            wrapper.setProps({ isLoading: false, justificationReasons, selectedJustificationReason });

            const justificationReasonsSelect = wrapper.find('[data-resin-target="justificationReasonsSelect"]');
            expect(justificationReasonsSelect).toHaveLength(1);
            expect(justificationReasonsSelect.props().options).toEqual(justificationReasons);
            expect(justificationReasonsSelect.props().selectedValue).toEqual(selectedJustificationReason.value);
            expect(wrapper.find('LoadingIndicator')).toHaveLength(0);
        });
    });

    describe('handlers', () => {
        test('should call onRemoveRestrictedExternalContacts when remove button is clicked within message', () => {
            const onRemoveRestrictedExternalContacts = jest.fn();
            wrapper.setProps({ onRemoveRestrictedExternalContacts });

            expect(onRemoveRestrictedExternalContacts).toHaveBeenCalledTimes(0);
            wrapper
                .find(`FormattedCompMessage[id="${pluralMessageId}"]`)
                .children('RemoveButton')
                .dive()
                .simulate('click');
            expect(onRemoveRestrictedExternalContacts).toHaveBeenCalledTimes(1);
        });

        test('should call onSelectJustificationReason with newly selected option on justification reason select change', () => {
            const onSelectJustificationReason = jest.fn();
            const expectedJustificationReason = { displayText: 'displayText', value: 'value' };
            wrapper.setProps({ onSelectJustificationReason });

            expect(onSelectJustificationReason).toHaveBeenCalledTimes(0);
            wrapper
                .find('[data-resin-target="justificationReasonsSelect"]')
                .simulate('change', expectedJustificationReason);
            expect(onSelectJustificationReason).toHaveBeenCalledTimes(1);
            expect(onSelectJustificationReason).toHaveBeenCalledWith(expectedJustificationReason);
        });
    });
});
