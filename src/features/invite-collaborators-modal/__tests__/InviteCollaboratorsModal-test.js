import React from 'react';
import sinon from 'sinon';

import { InviteCollaboratorsModalBase as InviteCollaboratorsModal } from '../InviteCollaboratorsModal';

const contacts = [
    { id: 0, name: 'Jackie', email: 'j@example.com', type: 'user' },
    { id: 1, name: 'Jeff', email: 'jt@example.com', type: 'user' },
    { id: 2, name: 'David', email: 'dt@example.com', type: 'user' },
    { id: 3, name: 'Yang', email: 'yz@example.com', type: 'user' },
    { id: 4, name: 'Yong', email: 'ysu@example.com', type: 'user' },
    { id: 5, name: 'Will', email: 'wy@example.com', type: 'user' },
    { id: 6, name: 'Dave', email: 'dj@example.com', type: 'user' },
    { id: 7, name: 'Ke', email: 'k@example.com', type: 'user' },
    { id: 8, name: 'Wenbo', email: 'w@example.com', type: 'user' },
    { id: 9, name: 'Engineers', type: 'group' },
    { id: 10, name: 'Junior Ballers', type: 'group' },
];

describe('features/invite-collaborators-modal/InviteCollaboratorsModal', () => {
    const sandbox = sinon.sandbox.create();
    const getWrapper = props =>
        shallow(
            <InviteCollaboratorsModal
                contacts={contacts}
                intl={{ formatMessage: sandbox.stub() }}
                itemName="My Example File"
                itemType="notFile"
                itemTypedID="12345"
                onRequestClose={sandbox.stub()}
                sendInvites={sandbox.stub()}
                {...props}
            />,
        );
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('constructor()', () => {
        test('should set initial state when defaultPersonalMessage and inviteePermissions are given', () => {
            const inviteePermissions = [
                { value: 'Uploader', text: 'Uploader', disabled: true },
                { value: 'Editor', text: 'Editor', disabled: false },
                { value: 'Owner', text: 'Owner', disabled: true },
            ];
            const defaultPersonalMessage = 'Hello, World!';
            const wrapper = getWrapper({
                defaultPersonalMessage,
                inviteePermissions,
            });

            expect(wrapper.state('message')).toEqual(defaultPersonalMessage);
            expect(wrapper.state('permission')).toEqual('Uploader');
        });

        test('should set initial state when defaultPersonalMessage and inviteePermissions are not given', () => {
            const wrapper = getWrapper();

            expect(wrapper.state('message')).toEqual('');
            expect(wrapper.state('permission')).toEqual('Editor');
        });
    });

    describe('getSelectorOptions()', () => {
        test('should correctly filter options that have yet to be selected by name and email', () => {
            const expectedSelectorOptions = [
                {
                    email: 'jt@example.com',
                    id: 1,
                    text: 'Jeff',
                    type: 'user',
                    value: 'jt@example.com',
                },
                {
                    email: undefined,
                    id: 10,
                    text: 'Junior Ballers',
                    type: 'group',
                    value: 10,
                },
            ];
            const selectedOptions = [
                {
                    email: 'j@example.com',
                    id: 0,
                    text: 'Jackie',
                    type: 'user',
                    value: 'j@example.com',
                },
                {
                    email: 'dj@example.com',
                    id: 6,
                    text: 'Dave',
                    type: 'user',
                    value: 'dj@example.com',
                },
            ];
            const wrapper = getWrapper({
                allowCustomPills: true,
            });
            wrapper.setState({
                pillSelectorInputValue: 'j',
                selectedOptions,
            });
            const result = wrapper.instance().getSelectorOptions();

            expect(result).toEqual(expectedSelectorOptions);
        });
    });

    describe('closeModal()', () => {
        test('should reset state and call onRequestClose', () => {
            const wrapper = getWrapper({
                onRequestClose: sandbox.mock(),
            });
            wrapper.setState({
                pillSelectorError: 'oops',
                pillSelectorInputValue: 'hello',
                selectedOptions: [{ text: 'Jackie', value: 'j@example.com' }],
            });

            wrapper.instance().closeModal();

            expect(wrapper.state('pillSelectorError')).toEqual('');
            expect(wrapper.state('pillSelectorInputValue')).toEqual('');
            expect(wrapper.state('selectedOptions').length).toBe(0);
        });
    });

    describe('sendInvites()', () => {
        test('should not send invites if error exists', () => {
            const wrapper = getWrapper({
                sendInvites: sandbox.mock().never(),
            });
            wrapper.setState({
                pillSelectorError: 'oops',
                selectedOptions: [{ text: 'Jackie', value: 'j@example.com' }],
            });

            wrapper.instance().sendInvites();
        });

        test('should not send invites if no options are selected', () => {
            const error = 'field required';
            const wrapper = getWrapper({
                intl: { formatMessage: sandbox.stub().returns(error) },
                sendInvites: sandbox.mock().never(),
            });
            wrapper.setState({
                pillSelectorError: '',
                selectedOptions: [],
            });

            wrapper.instance().sendInvites();

            expect(wrapper.state('pillSelectorError')).toEqual(error);
        });

        test('should send invites with the correct params', () => {
            const itemTypedID = '1234abc';
            const selectedOptions = [
                {
                    // group contact
                    text: 'Group',
                    type: 'group',
                    value: 55,
                },
                {
                    // user contact
                    text: 'Test',
                    type: 'user',
                    value: 'test@example.com',
                },
                {
                    // custom contact
                    text: 'Unicorn',
                    value: 'unicorn@example.com',
                },
                {
                    // group contact
                    text: 'Group',
                    type: 'group',
                    value: 79,
                },
            ];
            const message = 'Please join my folder';
            const permission = 'Owner';

            const props = {
                emails: 'test@example.com,unicorn@example.com',
                groupIDs: '55,79',
                emailMessage: message,
                permission,
                numsOfInvitees: 2,
                numOfInviteeGroups: 2,
            };

            const wrapper = getWrapper({
                itemTypedID,
                sendInvites: sandbox
                    .mock()
                    .withExactArgs(props)
                    .returns(Promise.resolve()),
            });
            wrapper.setState({
                message,
                permission,
                pillSelectorError: '',
                selectedOptions,
            });

            wrapper.instance().sendInvites();
        });
    });

    describe('filterInvitedEmails()', () => {
        test('should remove invited emails from selected options', () => {
            const selectedOptions = [
                {
                    // user contact
                    text: 'Test',
                    type: 'user',
                    value: 'test@example.com',
                },
                {
                    // custom contact
                    text: 'Unicorn',
                    value: 'unicorn@example.com',
                },
                {
                    // user contact
                    text: 'Aaron',
                    type: 'user',
                    value: 'aaron@example.com',
                },
                {
                    // custom contact
                    text: 'Hello',
                    value: 'hello@example.com',
                },
            ];

            const invitedEmails = ['hello@example.com', 'test@example.com', 'aaron@example.com'];
            const wrapper = getWrapper();
            wrapper.setState({
                selectedOptions,
            });

            wrapper.instance().filterInvitedEmails(invitedEmails);

            expect(wrapper.state('selectedOptions')).toEqual([
                {
                    text: 'Unicorn',
                    value: 'unicorn@example.com',
                },
            ]);
        });
    });

    describe('handlePillSelectorInput()', () => {
        test('should call onUserInput prop if it exists', () => {
            const wrapper = getWrapper({
                onUserInput: sandbox.mock().withExactArgs('j'),
            });

            wrapper.instance().handlePillSelectorInput('j');
        });

        test('should reset pillSelectorError and update pillSelectorInputValue state', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                pillSelectorError: 'error',
                pillSelectorInputValue: 'jjjjjjj',
            });

            wrapper.instance().handlePillSelectorInput('j');

            expect(wrapper.state('pillSelectorError')).toEqual('');
            expect(wrapper.state('pillSelectorInputValue')).toEqual('j');
        });
    });

    describe('handlePillSelect()', () => {
        test('should update selectedOptions state with newly selected options', () => {
            const selectedOptions = [
                {
                    id: 0,
                    text: 'Jackie',
                    type: 'user',
                    value: 'j@example.com',
                },
                {
                    id: 1,
                    text: 'Jeff',
                    type: 'user',
                    value: 'jt@example.com',
                },
                {
                    id: 10,
                    text: 'Junior Ballers',
                    type: 'group',
                    value: 10,
                },
            ];
            const newOptions = [
                {
                    id: 9,
                    text: 'Engineers',
                    type: 'group',
                    value: 9,
                },
            ];
            const wrapper = getWrapper();
            wrapper.setState({
                selectedOptions,
            });

            wrapper.instance().handlePillSelect(newOptions);

            expect(wrapper.state('selectedOptions')).toEqual([...selectedOptions, ...newOptions]);
        });
    });

    describe('handlePillRemove()', () => {
        test('should remove given index from selectedOptions state', () => {
            const selectedOptions = [
                {
                    id: 0,
                    text: 'Jackie',
                    type: 'user',
                    value: 'j@example.com',
                },
                {
                    id: 1,
                    text: 'Jeff',
                    type: 'user',
                    value: 'jt@example.com',
                },
                {
                    id: 10,
                    text: 'Junior Ballers',
                    type: 'group',
                    value: 10,
                },
            ];
            const wrapper = getWrapper();
            wrapper.setState({
                selectedOptions,
            });

            wrapper.instance().handlePillRemove({}, 1);

            expect(wrapper.state('selectedOptions')).toEqual([
                {
                    id: 0,
                    text: 'Jackie',
                    type: 'user',
                    value: 'j@example.com',
                },
                {
                    id: 10,
                    text: 'Junior Ballers',
                    type: 'group',
                    value: 10,
                },
            ]);
        });
    });

    describe('validateForError()', () => {
        test('should set an error if text is not a valid email', () => {
            const error = 'oops';
            const wrapper = getWrapper({
                intl: { formatMessage: sandbox.stub().returns(error) },
            });
            wrapper.setState({
                pillSelectorError: '',
            });

            wrapper.instance().validateForError('invalidEmail@box');

            expect(wrapper.state('pillSelectorError')).toEqual(error);
        });

        test('should not set an error if text is a valid email', () => {
            const error = 'oops';
            const wrapper = getWrapper({
                formatMessage: sandbox.stub().returns(error),
            });
            wrapper.setState({
                pillSelectorError: '',
            });

            wrapper.instance().validateForError('validEmail@example.com');

            expect(wrapper.state('pillSelectorError')).toEqual('');
        });
    });

    describe('validator()', () => {
        test('should return false if text is not a valid email', () => {
            const wrapper = getWrapper();
            expect(wrapper.instance().validator('invalidEmail@box')).toBe(false);
        });

        test('should return true if text is a valid email', () => {
            const wrapper = getWrapper();
            expect(wrapper.instance().validator('validEmail@example.com')).toBe(true);
        });
    });

    describe('handlePermissionChange()', () => {
        test('should update the permission state with the given target value', () => {
            const permission = 'Owner';
            const wrapper = getWrapper();
            wrapper.setState({
                permission: '',
            });

            wrapper.instance().handlePermissionChange({ target: { value: permission } });

            expect(wrapper.state('permission')).toEqual(permission);
        });
    });

    describe('handleMessageChange()', () => {
        test('should update the message state with the given target value', () => {
            const message = 'hello';
            const wrapper = getWrapper();
            wrapper.setState({
                message: '',
            });

            wrapper.instance().handleMessageChange({ target: { value: message } });

            expect(wrapper.state('message')).toEqual(message);
        });
    });

    describe('renderFileCollabComponents()', () => {
        test('should not render a Link when showUpgradeOptions is provided and itemType is file', () => {
            const wrapper = getWrapper({
                showUpgradeOptions: true,
                itemType: 'file',
            });

            const link = wrapper.find('Link');
            expect(link.length).toBe(0);
        });

        test('should not render a TextArea when defaultPersonalMessage is provided and itemType is file', () => {
            const wrapper = getWrapper({
                defaultPersonalMessage: 'Hello',
                itemType: 'file',
            });

            const textarea = wrapper.find('TextArea');
            expect(textarea.length).toBe(0);
        });

        test('should render a invite-file-editors div', () => {
            const wrapper = getWrapper({ itemType: 'file' });

            const fileEditorsDiv = wrapper.find('div.invite-file-editors');
            expect(fileEditorsDiv.length).toBe(1);
        });
    });

    describe('renderFolderCollabComponents()', () => {
        test('should render a Link to /upgrade if showUpgradeOptions is provided and itemType is not file', () => {
            const wrapper = getWrapper({ showUpgradeOptions: true });

            const link = wrapper.find('Link');
            expect(link.length).toBe(1);
            expect(link.prop('href')).toEqual('/upgrade');
            const upgradeBadge = link.find('UpgradeBadge');
            expect(upgradeBadge.length).toBe(1);
        });

        test('should not render a Link if showUpgradeOptions is not provided', () => {
            const wrapper = getWrapper();

            const link = wrapper.find('Link');
            expect(link.length).toBe(0);
        });

        test('should render a TextArea if defaultPersonalMessage is provided and itemType is not file', () => {
            const wrapper = getWrapper({ defaultPersonalMessage: 'Hello' });

            const textarea = wrapper.find('TextArea');
            expect(textarea.length).toBe(1);
            expect(textarea.prop('defaultValue')).toEqual('Hello');
            expect(textarea.prop('name')).toEqual('collab-message');
            expect(textarea.prop('cols')).toEqual('30');
            expect(textarea.prop('rows')).toEqual('4');
            expect(textarea.prop('onChange')).toEqual(wrapper.instance().handleMessageChange);
        });

        test('should not render a TextArea if defaultPersonalMessage is not provided', () => {
            const wrapper = getWrapper();

            const textarea = wrapper.find('TextArea');
            expect(textarea.length).toBe(0);
        });

        test('should not render a invite-file-editors div', () => {
            const wrapper = getWrapper();

            const fileEditorsDiv = wrapper.find('div.invite-file-editors');
            expect(fileEditorsDiv.length).toBe(0);
        });
    });

    describe('render()', () => {
        describe('Permission Section', () => {
            test('should render a Select and a PermissionFlyout when inviteePermissions prop is set', () => {
                const inviteePermissions = [
                    { value: 'Editor', text: 'Editor', disabled: false },
                    { value: 'Owner', text: 'Owner', disabled: true },
                    { value: 'Uploader', text: 'Uploader', disabled: true },
                ];
                const wrapper = getWrapper({
                    inviteePermissions,
                });
                const select = wrapper.find('Select');
                const flyout = wrapper.find('PermissionFlyout');
                expect(select.length).toBe(1);
                expect(flyout.length).toBe(1);
                expect(select.prop('onChange')).toEqual(wrapper.instance().handlePermissionChange);

                inviteePermissions.forEach(({ value, disabled }) => {
                    const option = select.find('option').filter({ value, disabled });
                    expect(option.length).toBe(1);
                });
            });

            test('should not render a Select and a PermissionFlyout when inviteePermissions prop is not set', () => {
                const wrapper = getWrapper();
                const select = wrapper.find('Select');
                const flyout = wrapper.find('PermissionFlyout');

                expect(select.length).toBe(0);
                expect(flyout.length).toBe(0);
            });

            test('should not render a Select and a PermissionFlyout when itemType is file', () => {
                const inviteePermissions = [
                    { value: 'Editor', text: 'Editor', disabled: false },
                    { value: 'Owner', text: 'Owner', disabled: true },
                    { value: 'Uploader', text: 'Uploader', disabled: true },
                ];
                const wrapper = getWrapper({
                    inviteePermissions,
                    itemType: 'file',
                });
                const select = wrapper.find('Select');
                const flyout = wrapper.find('PermissionFlyout');

                expect(select.length).toBe(0);
                expect(flyout.length).toBe(0);
            });
        });

        test('should render a Modal with the correct onRequestClose prop', () => {
            const wrapper = getWrapper();

            const modal = wrapper.find('Modal');
            expect(modal.length).toBe(1);
            expect(modal.prop('onRequestClose')).toEqual(wrapper.instance().closeModal);
        });

        test('should render an InlineNotice error if submissionError is provided', () => {
            const wrapper = getWrapper({
                submissionError: 'There was an error processing your request',
            });

            const notice = wrapper.find('InlineNotice');
            expect(notice.length).toBe(1);
            expect(notice.prop('type')).toEqual('error');
        });

        test('should not render an InlineNotice if submissionError is not provided', () => {
            const wrapper = getWrapper();

            const notice = wrapper.find('InlineNotice');
            expect(notice.length).toBe(0);
        });

        test('should render an InlineNotice warning if collaborationRestrictionWarning is provided', () => {
            const wrapper = getWrapper({
                collaborationRestrictionWarning: 'Hello',
            });

            const notice = wrapper.find('InlineNotice');
            expect(notice.length).toBe(1);
            expect(notice.prop('type')).toEqual('warning');
        });

        test('should not render an InlineNotice if collaborationRestrictionWarning is not provided', () => {
            const wrapper = getWrapper();

            const notice = wrapper.find('InlineNotice');
            expect(notice.length).toBe(0);
        });

        test('should render a PillSelectorDropdown with the correct props and children', () => {
            const selectedOptions = [
                {
                    id: 0,
                    text: 'Jackie',
                    type: 'user',
                    value: 'j@example.com',
                },
                {
                    id: 1,
                    text: 'Jeff',
                    type: 'user',
                    value: 'jt@example.com',
                },
                {
                    id: 10,
                    text: 'Junior Ballers',
                    type: 'group',
                    value: 10,
                },
            ];
            const selectorOptions = [
                {
                    email: 'dj@example.com',
                    id: 6,
                    text: 'Dave',
                    type: 'user',
                    value: 'dj@example.com',
                },
            ];
            const wrapper = getWrapper({
                allowCustomPills: true,
            });
            wrapper.setState({
                pillSelectorError: 'oops',
                pillSelectorInputValue: 'j',
                selectedOptions,
            });
            const instance = wrapper.instance();

            const pillSelectorDropdown = wrapper.find('PillSelectorDropdown');
            expect(pillSelectorDropdown.length).toBe(1);
            expect(pillSelectorDropdown.prop('allowCustomPills')).toBeTruthy();
            expect(pillSelectorDropdown.prop('error')).toEqual('oops');
            expect(pillSelectorDropdown.prop('onInput')).toEqual(instance.handlePillSelectorInput);
            expect(pillSelectorDropdown.prop('onRemove')).toEqual(instance.handlePillRemove);
            expect(pillSelectorDropdown.prop('onSelect')).toEqual(instance.handlePillSelect);
            expect(pillSelectorDropdown.prop('selectedOptions')).toEqual(selectedOptions);
            expect(pillSelectorDropdown.prop('selectorOptions')).toEqual(selectorOptions);
            expect(pillSelectorDropdown.prop('validateForError')).toEqual(instance.validateForError);
            expect(pillSelectorDropdown.prop('validator')).toEqual(instance.validator);

            const datalistItems = pillSelectorDropdown.find('ContactDatalistItem');
            expect(datalistItems.length).toEqual(selectorOptions.length);
        });

        test('should render a ReferAFriendAd if isEligibleForReferAFriendProgram is true', () => {
            const wrapper = getWrapper({
                isEligibleForReferAFriendProgram: true,
            });
            const fileEditorsDiv = wrapper.find('ReferAFriendAd');
            expect(fileEditorsDiv.length).toBe(1);
        });

        test('should not render a ReferAFriendAd if isEligibleForReferAFriendProgram is false', () => {
            const wrapper = getWrapper({
                isEligibleForReferAFriendProgram: false,
            });
            const fileEditorsDiv = wrapper.find('ReferAFriendAd');
            expect(fileEditorsDiv.length).toBe(0);
        });

        test('should render the correct ModalActions', () => {
            const wrapper = getWrapper();

            const modalActions = wrapper.find('ModalActions');
            expect(modalActions.length).toBe(1);

            const button = modalActions.find('Button');
            expect(button.length).toBe(1);

            const primaryButton = modalActions.find('PrimaryButton');
            expect(primaryButton.length).toBe(1);
        });

        test('should disable the ModalActions if request is submitting', () => {
            const wrapper = getWrapper({
                submitting: true,
            });

            const modalActions = wrapper.find('ModalActions');

            const button = modalActions.find('Button');
            expect(button.prop('isDisabled')).toBeTruthy();

            const primaryButton = modalActions.find('PrimaryButton');
            expect(primaryButton.prop('isDisabled')).toBeTruthy();
            expect(primaryButton.prop('isLoading')).toBeTruthy();
        });

        test('should not disable the ModalActions if request is not submitting', () => {
            const wrapper = getWrapper();

            const modalActions = wrapper.find('ModalActions');

            const button = modalActions.find('Button');
            expect(button.prop('isDisabled')).toBeFalsy();

            const primaryButton = modalActions.find('PrimaryButton');
            expect(primaryButton.prop('isDisabled')).toBeFalsy();
            expect(primaryButton.prop('isLoading')).toBeFalsy();
        });

        test('should call sendInvites if primary button is clicked', () => {
            const wrapper = getWrapper();

            const primaryButton = wrapper.find('PrimaryButton');
            expect(primaryButton.prop('onClick')).toEqual(wrapper.instance().sendInvites);
        });

        test('should call closeModal if cancel button is clicked', () => {
            const wrapper = getWrapper();

            const cancelButton = wrapper.find('Button');
            expect(cancelButton.prop('onClick')).toEqual(wrapper.instance().closeModal);
        });

        test('should pass down inviteButtonProps to the PrimaryButton', () => {
            const inviteButtonProps = { 'data-resin-target': 'invite' };
            const wrapper = getWrapper({ inviteButtonProps });

            expect(wrapper).toMatchSnapshot();
        });
    });
});
