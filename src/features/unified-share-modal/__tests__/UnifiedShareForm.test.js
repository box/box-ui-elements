import * as React from 'react';

import { ITEM_TYPE_WEBLINK, ITEM_TYPE_FOLDER } from '../../../common/constants';

import { UnifiedShareFormBase as UnifiedShareForm } from '../UnifiedShareForm';

describe('features/unified-share-modal/UnifiedShareForm', () => {
    const intl = { formatMessage: jest.fn() };
    const defaultItem = {
        id: '111',
        name: 'test file',
        type: 'file',
        grantedPermissions: {
            itemShare: true,
        },
        hideCollaborators: false,
    };
    const testPermission = {
        text: 'Editor',
        value: 'Editor',
    };
    const collaboratorsList = {
        collaborators: [],
    };
    const defaultTrackingProps = {
        inviteCollabsEmailTracking: {},
        sharedLinkEmailTracking: {},
        sharedLinkTracking: {},
        inviteCollabTracking: {},
        modalTracking: {},
        removeLinkConfirmModalTracking: {},
    };
    const getWrapper = (props = {}) =>
        shallow(
            <UnifiedShareForm
                classification={{ definition: undefined, name: undefined }}
                collaborationRestrictionWarning=""
                collaboratorsList={collaboratorsList}
                handleFtuxCloseClick={() => null}
                intl={intl}
                inviteePermissions={[testPermission]}
                item={defaultItem}
                sharedLink={{}}
                trackingProps={props.trackingProps || defaultTrackingProps}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render a default component with default props', () => {
            const wrapper = getWrapper({ isFetching: false });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render an allShareRestrictionWarning message when it is available', () => {
            const SharingRestrictionWarning = <div className="test-class">Sharing is prohibited</div>;
            const wrapper = getWrapper({ allShareRestrictionWarning: SharingRestrictionWarning, isFetching: false });
            expect(wrapper.find('.test-class')).toMatchSnapshot();
        });

        test('should render a default component in initial loading state', () => {
            const wrapper = getWrapper({ isFetching: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component when showing invite section expanded', () => {
            const wrapper = getWrapper({
                isFetching: false,
            });
            wrapper.setState({
                isInviteSectionExpanded: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component FTUX based on enabled prop and state', () => {
            const wrapper = getWrapper({
                shouldRenderFTUXTooltip: true,
                showCalloutForUser: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should not render a default component FTUX when prop is false', () => {
            const wrapper = getWrapper({
                shouldRenderFTUXTooltip: true,
                showCalloutForUser: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should not render a default component FTUX when state is false', () => {
            const wrapper = getWrapper({
                showCalloutForUser: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with confirm modal open', () => {
            const wrapper = getWrapper({ isConfirmModalOpen: true, isFetching: false, closeConfirmModal: () => null });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component when the user cannot invite collaborators due to permissions', () => {
            const item = { ...defaultItem, type: ITEM_TYPE_FOLDER };
            const wrapper = getWrapper({
                canInvite: false,
                item,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component when the user cannot invite collaborators due to item type of weblink', () => {
            const item = { ...defaultItem, type: ITEM_TYPE_WEBLINK };
            const wrapper = getWrapper({
                canInvite: false,
                isFetching: false,
                item,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with send invite error specified', () => {
            const errorNode = <span>Some Error</span>;
            const wrapper = getWrapper({
                canInvite: true,
                isFetching: false,
                sendInvitesError: errorNode,
            });

            wrapper.setState({
                isInviteSectionExpanded: true,
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with collaboration restriction warning specified and invite section is expanded', () => {
            const collaborationRestrictionWarning =
                'Collaboration invitations can only be sent to people within company.';
            const wrapper = getWrapper({
                canInvite: true,
                collaborationRestrictionWarning,
                isFetching: false,
            });

            wrapper.setState({
                isInviteSectionExpanded: true,
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with collaboration restriction warning specified and invite section is NOT expanded', () => {
            const collaborationRestrictionWarning =
                'Collaboration invitations can only be sent to people within company.';
            const wrapper = getWrapper({
                canInvite: true,
                collaborationRestrictionWarning,
                isFetching: false,
            });

            wrapper.setState({
                isInviteSectionExpanded: false,
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with invitee permissions listed', () => {
            const wrapper = getWrapper({
                canInvite: true,
                inviteePermissions: ['Editor'],
                isFetching: false,
                submitting: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with upgrade CTA when showUpgradeOptions is enabled', () => {
            const wrapper = getWrapper({
                canInvite: true,
                isFetching: false,
                showUpgradeOptions: true,
            });
            wrapper.setState({
                isInviteSectionExpanded: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with correct Focus element and props when focusSharedLinkOnLoad is enabled', () => {
            const wrapper = getWrapper({
                focusSharedLinkOnLoad: true,
                sharedLink: {
                    url: 'https://foo.com',
                },
                sharedLinkLoaded: true,
            });
            wrapper.setState({
                isEmailLinkSectionExpanded: false,
                isInviteSectionExpanded: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a component with autofocus set for shared link when focusSharedLinkOnLoad is enabled and there is a shared link', () => {
            const wrapper = getWrapper({
                focusSharedLinkOnLoad: true,
                sharedLink: {
                    url: 'https://foo.com',
                },
                sharedLinkLoaded: true,
            });
            wrapper.setState({
                isEmailLinkSectionExpanded: false,
                isInviteSectionExpanded: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with collaborator list if showCollaboratorList state is set', () => {
            const collaborators = [
                {
                    name: 'test a',
                    hasCustomAvatar: false,
                },
                {
                    name: 'test b',
                    hasCustomAvatar: false,
                },
            ];

            const wrapper = getWrapper({
                collaboratorsList: {
                    ...collaboratorsList,
                    collaborators,
                },
            });
            wrapper.setState({ showCollaboratorList: true });
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('renderCollaboratorAvatars()', () => {
        test('should not render if hideCollaborators is true and canInvite is false', () => {
            const wrapper = getWrapper({
                canInvite: false,
                item: { hideCollaborators: true },
            });
            const emailForm = wrapper.find('EmailForm');
            const contactsFieldAvatars = emailForm.prop('contactsFieldAvatars');
            expect(contactsFieldAvatars).toMatchSnapshot();
        });

        test('should filter out current user', () => {
            const wrapper = getWrapper({
                currentUserID: '1234',
                collaboratorsList: {
                    collaborators: [{ userID: 1234 }, { userID: 5678 }],
                },
            });
            const emailForm = wrapper.find('EmailForm');
            const contactsFieldAvatars = emailForm.prop('contactsFieldAvatars');
            expect(contactsFieldAvatars).toMatchSnapshot();
        });
    });

    describe('onToggleSharedLink()', () => {
        test('should open the confirm modal when the toggle is set to false', () => {
            const onHandleFtuxCloseClickStub = jest.fn();
            const onOpenConfirmModalStub = jest.fn();
            const onToggleSharedLinkStub = jest.fn();
            const input = mount(<input type="checkbox" readOnly />);
            const trackingProps = {
                ...defaultTrackingProps,
                sharedLinkTracking: {
                    onToggleLink: onToggleSharedLinkStub,
                },
            };
            const wrapper = getWrapper({
                handleFtuxCloseClick: onHandleFtuxCloseClickStub,
                openConfirmModal: onOpenConfirmModalStub,
                sharedLink: {
                    canChangeAccessLevel: true,
                    url: 'https://example.com/shared-link',
                },
                shouldRenderFTUXTooltip: true,
                trackingProps,
            });

            wrapper.instance().onToggleSharedLink({
                target: input.instance(),
            });

            expect(onHandleFtuxCloseClickStub).toHaveBeenCalled();
            expect(onOpenConfirmModalStub).toHaveBeenCalled();
            expect(onToggleSharedLinkStub).toHaveBeenCalled();
        });

        test('should add the link when the the toggle is set to true', () => {
            const onHandleFtuxCloseClickStub = jest.fn();
            const onToggleSharedLinkStub = jest.fn();
            const onAddLinkStub = jest.fn();
            const trackingProps = {
                ...defaultTrackingProps,
                sharedLinkTracking: {
                    onToggleLink: onToggleSharedLinkStub,
                },
            };
            const input = mount(<input type="checkbox" checked readOnly />);

            const wrapper = getWrapper({
                sharedLink: {
                    url: 'https://example.com/shared-link',
                },
                trackingProps,
                onAddLink: onAddLinkStub,
            });

            wrapper.instance().onToggleSharedLink({
                target: input.instance(),
            });

            expect(onHandleFtuxCloseClickStub).not.toHaveBeenCalled();
            expect(onToggleSharedLinkStub).toHaveBeenCalled();
        });
    });

    describe('handleSendInvites()', () => {
        test('should call sendInvites with correct params', () => {
            const sendInvites = jest.fn();
            const wrapper = getWrapper({ sendInvites });
            wrapper.setState({ inviteePermissionLevel: 'Editor' });
            wrapper.instance().handleSendInvites({
                emails: ['dvader@example.com', 'fbar@example.com'],
                groupIDs: ['eng@example.com', 'product@example.com'],
                message: 'Yo',
            });
            expect(sendInvites).toBeCalledWith({
                emails: 'dvader@example.com,fbar@example.com',
                groupIDs: 'eng@example.com,product@example.com',
                emailMessage: 'Yo',
                permission: 'Editor',
                numsOfInvitees: 2,
                numOfInviteeGroups: 2,
            });
        });
    });

    describe('handleInviteePermissionChange()', () => {
        test('should set the permission in the state', () => {
            const onInviteePermissionChange = jest.fn();
            const trackingProps = {
                ...defaultTrackingProps,
                inviteCollabTracking: {
                    onInviteePermissionChange,
                },
            };
            const wrapper = getWrapper({ trackingProps });

            wrapper.instance().handleInviteePermissionChange('Editor');

            expect(wrapper.state('inviteePermissionLevel')).toEqual('Editor');
            expect(onInviteePermissionChange).toBeCalledWith('Editor');
        });
    });

    describe('openInviteCollaborators()', () => {
        test('should set state to open if value is not empty', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                isInviteSectionExpanded: false,
            });
            wrapper.instance().openInviteCollaborators('t');
            expect(wrapper.state('isInviteSectionExpanded')).toBe(true);
        });

        test('should leave state closed if value is empty', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                isInviteSectionExpanded: false,
            });
            wrapper.instance().openInviteCollaborators('');
            expect(wrapper.state('isInviteSectionExpanded')).toBe(false);
        });

        test('should call onEnterInviteCollabs if invite section expanded first time', () => {
            const onEnterInviteCollabs = jest.fn();
            const wrapper = getWrapper({
                trackingProps: {
                    ...defaultTrackingProps,
                    inviteCollabTracking: {
                        onEnterInviteCollabs,
                    },
                },
            });
            wrapper.setState({
                isInviteSectionExpanded: false,
            });
            wrapper.instance().openInviteCollaborators('t');
            expect(onEnterInviteCollabs).toBeCalled();
            expect(wrapper.state('isInviteSectionExpanded')).toBe(true);
        });
    });

    describe('openInviteCollaboratorsSection()', () => {
        test('should set isInviteSectionExpanded to true', () => {
            const wrapper = getWrapper();
            wrapper.setState({ isInviteSectionExpanded: false });
            wrapper.instance().openInviteCollaboratorsSection();
            expect(wrapper.state('isInviteSectionExpanded')).toBe(true);
        });
    });

    describe('closeInviteCollaborators()', () => {
        test('should set state properly', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                isFetching: false,
                isInviteSectionExpanded: true,
            });
            wrapper.instance().closeInviteCollaborators();
            expect(wrapper.state('isInviteSectionExpanded')).toBe(false);
        });
    });

    describe('openEmailSharedLinkForm()', () => {
        test('should set state properly', () => {
            const onHandleFtuxCloseClickStub = jest.fn();
            const wrapper = getWrapper({
                handleFtuxCloseClick: onHandleFtuxCloseClickStub,
                isFetching: false,
                shouldRenderFTUXTooltip: true,
            });
            wrapper.setState({
                isEmailLinkSectionExpanded: false,
            });
            wrapper.instance().openEmailSharedLinkForm();
            expect(wrapper.state('isEmailLinkSectionExpanded')).toBe(true);
            expect(onHandleFtuxCloseClickStub).toHaveBeenCalled();

            // when this state is set, confirm the layout is correct
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('closeEmailSharedLinkForm()', () => {
        test('should set state properly', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                isFetching: false,
                isEmailLinkSectionExpanded: true,
            });
            wrapper.instance().closeEmailSharedLinkForm();
            expect(wrapper.state('isEmailLinkSectionExpanded')).toBe(false);

            // when this state is set, confirm the layout is correct
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('shouldAutoFocusSharedLink()', () => {
        test('should return false if not forced focus or a new shared link', () => {
            const wrapper = getWrapper({
                focusSharedLinkOnLoad: false,
                sharedLink: {
                    isNewSharedLink: false,
                },
                sharedLinkLoaded: false,
            });

            expect(wrapper.instance().shouldAutoFocusSharedLink()).toBe(false);
        });

        test('should return false if shared link is not yet loaded', () => {
            const wrapper = getWrapper({
                focusSharedLinkOnLoad: true,
                sharedLink: {
                    isNewSharedLink: false,
                },
                sharedLinkLoaded: false,
            });

            expect(wrapper.instance().shouldAutoFocusSharedLink()).toBe(false);
        });

        test('should return true if forced focus and link is loaded', () => {
            const wrapper = getWrapper({
                focusSharedLinkOnLoad: true,
                sharedLink: {
                    isNewSharedLink: false,
                },
                sharedLinkLoaded: true,
            });

            expect(wrapper.instance().shouldAutoFocusSharedLink()).toBe(true);
        });

        test('should return true if new shared link and link is loaded', () => {
            const wrapper = getWrapper({
                focusSharedLinkOnLoad: false,
                sharedLink: {
                    isNewSharedLink: true,
                },
                sharedLinkLoaded: true,
            });

            expect(wrapper.instance().shouldAutoFocusSharedLink()).toBe(true);
        });
    });

    describe('onPillCreate()', () => {
        const email = 'dev@box.com';
        const displayText = email;
        const name = 'dev';
        const text = name;
        const id = 123;
        const type = 'user';
        const isExternalUser = true;
        const value = email;
        const inviteCollabsContacts = [
            {
                displayText: email,
                value: email,
            },
        ];
        const emailSharedLinkContacts = [
            {
                displayText: email,
                value: email,
            },
        ];

        test('should not retrieve emails if all the pills are select type', async () => {
            const pills = [{ id: 123 }, { id: 456 }];
            const getContactsByEmail = jest.fn();
            const wrapper = getWrapper({ getContactsByEmail });
            await wrapper.instance().onPillCreate('test', pills);
            expect(getContactsByEmail).not.toHaveBeenCalled();
        });

        test('should retrieve emails and set the state for invite collabs contacts when the pills are mixed of selectType and contactType', async () => {
            const pills = [{ displayText, text, value }, { id: 123 }];
            const state = {
                inviteCollabsContacts,
            };
            const getContactsByEmail = jest.fn().mockResolvedValue({
                [email]: {
                    email,
                    id,
                    isExternalUser,
                    name,
                    type,
                },
            });
            const expectedSelectedContacts = [
                {
                    email,
                    id,
                    isExternalUser,
                    name,
                    text,
                    type,
                    value,
                },
            ];
            const wrapper = getWrapper({ getContactsByEmail });
            wrapper.setState(state);
            await wrapper.instance().onPillCreate('inviteCollabsContacts', pills);
            const newSelectedContacts = wrapper.state('inviteCollabsContacts');
            expect(newSelectedContacts).toEqual(expectedSelectedContacts);
        });

        test('should retrieve emails and set the state for email shared link contacts', async () => {
            const pills = [{ displayText, text, value }];
            const state = {
                emailSharedLinkContacts,
            };
            const getContactsByEmail = jest.fn().mockResolvedValue({
                [email]: {
                    email,
                    id,
                    isExternalUser,
                    name,
                    type,
                },
            });
            const expectedSelectedContacts = [
                {
                    email,
                    id,
                    isExternalUser,
                    name,
                    text,
                    type,
                    value,
                },
            ];
            const wrapper = getWrapper({ getContactsByEmail });
            wrapper.setState(state);
            await wrapper.instance().onPillCreate('emailSharedLinkContacts', pills);
            const newSelectedContacts = wrapper.state('emailSharedLinkContacts');
            expect(newSelectedContacts).toEqual(expectedSelectedContacts);
        });
    });

    describe('hasExternalContact()', () => {
        test('should return true if the invited collabs include at least one external user', () => {
            const contacts = [
                {
                    email: 'x@example.com',
                    id: '12345',
                    isExternalUser: false,
                    name: 'X User',
                    type: 'group',
                },
                {
                    email: 'y@example.com',
                    id: '23456',
                    isExternalUser: true,
                    name: 'Y User',
                    type: 'user',
                },
                {
                    email: 'z@example.com',
                    id: '34567',
                    isExternalUser: false,
                    name: 'Z User',
                    type: 'user',
                },
            ];

            const wrapper = getWrapper();
            wrapper.setState({ inviteCollabsContacts: contacts });
            expect(wrapper.instance().hasExternalContact('inviteCollabsContacts')).toBe(true);
        });

        test('should return false if the invited collabs does not include any external user', () => {
            const contacts = [
                {
                    email: 'x@example.com',
                    id: '12345',
                    isExternalUser: false,
                    name: 'X User',
                    type: 'group',
                },
                {
                    email: 'z@example.com',
                    id: '34567',
                    isExternalUser: false,
                    name: 'Z User',
                    type: 'user',
                },
            ];

            const wrapper = getWrapper();
            wrapper.setState({ inviteCollabsContacts: contacts });
            expect(wrapper.instance().hasExternalContact('inviteCollabsContacts')).toBe(false);
        });

        test('should return true if the "Email Shared Link" contacts include at least one external user', () => {
            const contacts = [
                {
                    email: 'x@example.com',
                    id: '12345',
                    isExternalUser: false,
                    name: 'X User',
                    type: 'group',
                },
                {
                    email: 'y@example.com',
                    id: '23456',
                    isExternalUser: true,
                    name: 'Y User',
                    type: 'user',
                },
                {
                    email: 'z@example.com',
                    id: '34567',
                    isExternalUser: false,
                    name: 'Z User',
                    type: 'user',
                },
            ];

            const wrapper = getWrapper();
            wrapper.setState({ emailSharedLinkContacts: contacts });
            expect(wrapper.instance().hasExternalContact('emailSharedLinkContacts')).toBe(true);
        });

        test('should not set isExternalUserInEmailSharedLinkContacts to true if the "Email Shared Link" contacts does not include any external user', () => {
            const contacts = [
                {
                    email: 'x@example.com',
                    id: '12345',
                    isExternalUser: false,
                    name: 'X User',
                    type: 'group',
                },
                {
                    email: 'z@example.com',
                    id: '34567',
                    isExternalUser: false,
                    name: 'Z User',
                    type: 'user',
                },
            ];

            const wrapper = getWrapper();
            wrapper.setState({ emailSharedLinkContacts: contacts });
            expect(wrapper.instance().hasExternalContact('emailSharedLinkContacts')).toBe(false);
        });

        test('should set isInviteSectionExpanded and inviteCollabsContacts correctly if there are initiallySelectedContacts', () => {
            const initiallySelectedContacts = [
                {
                    email: 'x@example.com',
                    id: '12345',
                    isExternalUser: false,
                    name: 'X User',
                    type: 'group',
                },
            ];

            const wrapper = getWrapper({ initiallySelectedContacts });
            expect(wrapper.state('inviteCollabsContacts')).toEqual(initiallySelectedContacts);
            expect(wrapper.state('isInviteSectionExpanded')).toEqual(true);
        });

        test('should set isInviteSectionExpanded and inviteCollabsContacts correctly if there are NO initiallySelectedContacts', () => {
            const wrapper = getWrapper();
            expect(wrapper.state('inviteCollabsContacts')).toEqual([]);
            expect(wrapper.state('isInviteSectionExpanded')).toEqual(false);
        });
    });

    describe('renderCollaboratorAvatars()', () => {
        test('should not render if hideCollaborators is true and canInvite is false', () => {
            const wrapper = getWrapper({
                canInvite: false,
                item: { hideCollaborators: true },
            });
            const emailForm = wrapper.find('EmailForm');
            const contactsFieldAvatars = emailForm.prop('contactsFieldAvatars');
            expect(contactsFieldAvatars).toMatchSnapshot();
        });

        test('should filter out current user', () => {
            const wrapper = getWrapper({
                currentUserID: '1234',
                collaboratorsList: {
                    collaborators: [{ userID: 1234 }, { userID: 5678 }],
                },
            });
            const emailForm = wrapper.find('EmailForm');
            const contactsFieldAvatars = emailForm.prop('contactsFieldAvatars');
            expect(contactsFieldAvatars).toMatchSnapshot();
        });
    });
});
