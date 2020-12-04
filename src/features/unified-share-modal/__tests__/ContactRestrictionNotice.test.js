// @flow
import React from 'react';
import { shallow } from 'enzyme';

import messages from '../messages';

import { ContactRestrictionNoticeComponent as ContactRestrictionNotice } from '../ContactRestrictionNotice';

describe('features/unified-share-modal/ContactRestrictionNotice', () => {
    let wrapper;
    let selectedContacts;
    let restrictedExternalEmails;

    const getWrapper = (props = {}) => {
        return shallow(
            <ContactRestrictionNotice
                error=""
                intl={{ formatMessage: jest.fn() }}
                isFetchingJustificationReasons={false}
                isRestrictionJustificationEnabled={false}
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
            expect(wrapper.is('Tooltip')).toBe(true);
            expect(wrapper.find('InlineNotice')).toHaveLength(1);
            expect(wrapper.find('[data-resin-target="removeBtn"]')).toHaveLength(1);
        });

        test('should render nothing when there are no restricted external contacts', () => {
            wrapper.setProps({ restrictedExternalEmails: [], selectedContacts });
            expect(wrapper.isEmptyRender()).toBe(true);

            wrapper.setProps({ restrictedExternalEmails, selectedContacts: [] });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        test.each`
            isRestrictionJustificationEnabled | restrictedExternalContactCount | restrictionNoticeMessageId                                 | removeButtonMessageId
            ${false}                          | ${1}                           | ${messages.contactRestrictionNoticeSingular.id}            | ${messages.contactRestrictionRemoveButtonLabel.id}
            ${false}                          | ${2}                           | ${messages.contactRestrictionNotice.id}                    | ${messages.contactRestrictionRemoveButtonLabel.id}
            ${true}                           | ${1}                           | ${messages.justifiableContactRestrictionNoticeSingular.id} | ${messages.justifiableContactRestrictionRemoveButtonLabel.id}
            ${true}                           | ${2}                           | ${messages.justifiableContactRestrictionNotice.id}         | ${messages.justifiableContactRestrictionRemoveButtonLabel.id}
        `(
            'should select appropriate messages when isRestrictionJustificationEnabled is $isRestrictionJustificationEnabled and restricted external contact count is $restrictedExternalContactCount',
            ({
                isRestrictionJustificationEnabled,
                restrictedExternalContactCount,
                restrictionNoticeMessageId,
                removeButtonMessageId,
            }) => {
                restrictedExternalEmails = restrictedExternalEmails.slice(0, restrictedExternalContactCount);
                wrapper.setProps({ isRestrictionJustificationEnabled, restrictedExternalEmails });

                const restrictionNoticeMessage = wrapper.find(`FormattedMessage[id="${restrictionNoticeMessageId}"]`);
                const removeButtonMessage = wrapper.find(`FormattedMessage[id="${removeButtonMessageId}"]`);

                expect(restrictionNoticeMessage).toHaveLength(1);
                expect(restrictionNoticeMessage.props().values).toEqual({
                    count: restrictedExternalEmails.length,
                    email: selectedContacts[0].value,
                });
                expect(removeButtonMessage).toHaveLength(1);
                expect(removeButtonMessage.props().values).toEqual({
                    count: restrictedExternalEmails.length,
                });
            },
        );

        test('should display error tooltip when error is provided', () => {
            const error = 'error';

            wrapper.setProps({ error: undefined });
            expect(wrapper.find('Tooltip').props().isShown).toBe(false);

            wrapper.setProps({ error });
            expect(wrapper.find('Tooltip').props().text).toBe(error);
            expect(wrapper.find('Tooltip').props().isShown).toBe(true);
        });

        test('should render a loading indicator instead of the justification reasons select when isFetchingJustificationReasons is true', () => {
            wrapper.setProps({ isFetchingJustificationReasons: true, isRestrictionJustificationEnabled: true });

            expect(wrapper.find('[data-resin-target="justificationReasonsSelect"]')).toHaveLength(0);
            expect(wrapper.find('LoadingIndicator')).toHaveLength(1);
        });

        test('should render justification reasons select when isFetchingJustificationReasons is false and isRestrictionJustificationEnabled is true', () => {
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
            wrapper.setProps({
                isFetchingJustificationReasons: false,
                isRestrictionJustificationEnabled: true,
                justificationReasons,
                selectedJustificationReason,
            });

            const justificationReasonsSelect = wrapper.find('[data-resin-target="justificationReasonsSelect"]');
            expect(justificationReasonsSelect).toHaveLength(1);
            expect(justificationReasonsSelect.props().options).toEqual(justificationReasons);
            expect(justificationReasonsSelect.props().selectedValue).toEqual(selectedJustificationReason.value);
            expect(wrapper.find('LoadingIndicator')).toHaveLength(0);
        });
    });

    describe('handlers', () => {
        test('should call onRemoveRestrictedExternalContacts when remove button is clicked', () => {
            const onRemoveRestrictedExternalContacts = jest.fn();
            wrapper.setProps({ onRemoveRestrictedExternalContacts });

            expect(onRemoveRestrictedExternalContacts).toHaveBeenCalledTimes(0);
            wrapper.find('[data-resin-target="removeBtn"]').simulate('click');
            expect(onRemoveRestrictedExternalContacts).toHaveBeenCalledTimes(1);
        });

        test('should call onSelectJustificationReason with newly selected option on justification reason select change', () => {
            const onSelectJustificationReason = jest.fn();
            const expectedJustificationReason = { displayText: 'displayText', value: 'value' };
            wrapper.setProps({ isRestrictionJustificationEnabled: true, onSelectJustificationReason });

            expect(onSelectJustificationReason).toHaveBeenCalledTimes(0);
            wrapper
                .find('[data-resin-target="justificationReasonsSelect"]')
                .simulate('change', expectedJustificationReason);
            expect(onSelectJustificationReason).toHaveBeenCalledTimes(1);
            expect(onSelectJustificationReason).toHaveBeenCalledWith(expectedJustificationReason);
        });
    });
});
