// @flow
import React from 'react';
import { shallow } from 'enzyme';

import { COLLAB_RESTRICTION_TYPE_ACCESS_POLICY, COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER } from '../constants';

import messages from '../messages';

import { ContactRestrictionNoticeComponent as ContactRestrictionNotice } from '../ContactRestrictionNotice';

describe('features/unified-share-modal/ContactRestrictionNotice', () => {
    let wrapper;
    let selectedContacts;
    let restrictedEmails;
    let restrictedGroups;

    const getWrapper = (props = {}) => {
        return shallow(
            <ContactRestrictionNotice
                collabRestrictionType={undefined}
                error=""
                intl={{ formatMessage: jest.fn() }}
                isFetchingJustificationReasons={false}
                isRestrictionJustificationEnabled={false}
                justificationReasons={[]}
                onRemoveRestrictedContacts={jest.fn()}
                onSelectJustificationReason={jest.fn()}
                restrictedEmails={restrictedEmails}
                restrictedGroups={restrictedGroups}
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
                id: 12345,
                text: 'X User',
                type: 'user',
                value: 'x@example.com',
            },
            {
                email: 'y@example.com',
                id: 23456,
                text: 'Y User',
                type: 'user',
                value: 'y@example.com',
            },
            {
                email: 'z@example.com',
                id: 34567,
                text: 'Z User',
                type: 'user',
                value: 'z@example.com',
            },
            {
                id: 45678,
                text: 'Test Group 1',
                type: 'group',
            },
            {
                id: 56789,
                text: 'Test Group 2',
                type: 'group',
            },
        ];
        restrictedEmails = ['x@example.com', 'y@example.com'];
        restrictedGroups = [45678, 56789];

        wrapper = getWrapper();
    });

    describe('render', () => {
        test('should render default ContactRestrictionNotice component', () => {
            expect(wrapper.is('Tooltip')).toBe(true);
            expect(wrapper.find('InlineNotice')).toHaveLength(1);
            expect(wrapper.find('[data-resin-target="removeBtn"]')).toHaveLength(1);
        });

        test('should render nothing when there are no restricted contacts', () => {
            wrapper.setProps({ restrictedEmails: [], restrictedGroups: [], selectedContacts });
            expect(wrapper.isEmptyRender()).toBe(true);

            wrapper.setProps({ restrictedEmails, selectedContacts: [] });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        test.each`
            collabRestrictionType                          | isRestrictionJustificationEnabled | restrictedContactCount | restrictionNoticeMessageId                                        | removeButtonMessageId
            ${COLLAB_RESTRICTION_TYPE_ACCESS_POLICY}       | ${false}                          | ${1}                   | ${messages.contactRestrictionNoticeSingular.id}                   | ${messages.contactRestrictionRemoveButtonLabel.id}
            ${COLLAB_RESTRICTION_TYPE_ACCESS_POLICY}       | ${false}                          | ${2}                   | ${messages.contactRestrictionNotice.id}                           | ${messages.contactRestrictionRemoveButtonLabel.id}
            ${COLLAB_RESTRICTION_TYPE_ACCESS_POLICY}       | ${true}                           | ${1}                   | ${messages.justifiableContactRestrictionNoticeSingular.id}        | ${messages.justifiableContactRestrictionRemoveButtonLabel.id}
            ${COLLAB_RESTRICTION_TYPE_ACCESS_POLICY}       | ${true}                           | ${2}                   | ${messages.justifiableContactRestrictionNotice.id}                | ${messages.justifiableContactRestrictionRemoveButtonLabel.id}
            ${COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER} | ${false}                          | ${1}                   | ${messages.contactRestrictionNoticeInformationBarrierSingular.id} | ${messages.contactRestrictionRemoveButtonLabel.id}
            ${COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER} | ${false}                          | ${2}                   | ${messages.contactRestrictionNoticeInformationBarrier.id}         | ${messages.contactRestrictionRemoveButtonLabel.id}
        `(
            'should select appropriate messages when restriction type is "$collabRestrictionType",  isRestrictionJustificationEnabled is $isRestrictionJustificationEnabled and restricted contact count is $restrictedContactCount',
            ({
                collabRestrictionType,
                isRestrictionJustificationEnabled,
                restrictedContactCount,
                restrictionNoticeMessageId,
                removeButtonMessageId,
            }) => {
                restrictedEmails = restrictedEmails.slice(0, restrictedContactCount);
                wrapper.setProps({
                    collabRestrictionType,
                    isRestrictionJustificationEnabled,
                    restrictedEmails,
                    restrictedGroups: [],
                });

                const restrictionNoticeMessage = wrapper.find(`FormattedMessage[id="${restrictionNoticeMessageId}"]`);
                const removeButtonMessage = wrapper.find(`FormattedMessage[id="${removeButtonMessageId}"]`);

                expect(restrictionNoticeMessage).toHaveLength(1);
                expect(restrictionNoticeMessage.props().values).toEqual({
                    count: restrictedEmails.length,
                    email: selectedContacts[0].value,
                    groupName: undefined,
                });
                expect(removeButtonMessage).toHaveLength(1);
                expect(removeButtonMessage.props().values).toEqual({
                    count: restrictedEmails.length,
                });
            },
        );

        test.each`
            restrictedGroupCount | restrictionNoticeMessageId                                             | removeButtonMessageId
            ${1}                 | ${messages.contactRestrictionNoticeInformationBarrierSingularGroup.id} | ${messages.contactRestrictionRemoveButtonLabel.id}
            ${2}                 | ${messages.contactRestrictionNoticeInformationBarrier.id}              | ${messages.contactRestrictionRemoveButtonLabel.id}
        `(
            'should select appropriate messages when restricted group count is $restrictedGroupCount',
            ({ restrictedGroupCount, restrictionNoticeMessageId, removeButtonMessageId }) => {
                restrictedGroups = restrictedGroups.slice(0, restrictedGroupCount);
                wrapper.setProps({
                    collabRestrictionType: COLLAB_RESTRICTION_TYPE_INFORMATION_BARRIER,
                    restrictedEmails: [],
                    restrictedGroups,
                });

                const restrictionNoticeMessage = wrapper.find(`FormattedMessage[id="${restrictionNoticeMessageId}"]`);
                const removeButtonMessage = wrapper.find(`FormattedMessage[id="${removeButtonMessageId}"]`);

                expect(restrictionNoticeMessage).toHaveLength(1);
                expect(restrictionNoticeMessage.props().values).toEqual({
                    count: restrictedGroups.length,
                    email: undefined,
                    groupName: selectedContacts[3].text,
                });
                expect(removeButtonMessage).toHaveLength(1);
                expect(removeButtonMessage.props().values).toEqual({
                    count: restrictedGroups.length,
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
        test('should call onRemoveRestrictedContacts when remove button is clicked', () => {
            const onRemoveRestrictedContacts = jest.fn();
            wrapper.setProps({ onRemoveRestrictedContacts });

            expect(onRemoveRestrictedContacts).toHaveBeenCalledTimes(0);
            wrapper.find('[data-resin-target="removeBtn"]').simulate('click');
            expect(onRemoveRestrictedContacts).toHaveBeenCalledTimes(1);
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
