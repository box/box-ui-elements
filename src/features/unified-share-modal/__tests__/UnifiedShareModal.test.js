import * as React from 'react';

import { ITEM_TYPE_WEBLINK, ITEM_TYPE_FOLDER } from '../../../common/constants';

import { UnifiedShareModalBase as UnifiedShareModal } from '../UnifiedShareModal';

describe('features/unified-share-modal/UnifiedShareModal', () => {
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
            <UnifiedShareModal
                classification={{ definition: undefined, name: undefined }}
                collaborationRestrictionWarning=""
                collaboratorsList={collaboratorsList}
                getInitialData={jest.fn().mockImplementation(() => Promise.resolve('test'))}
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
            const wrapper = getWrapper();
            wrapper.setState({ isFetching: false });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a component with onLoadSharedLink callback called when shared link data returns', () => {
            const onLoadSharedLinkMock = jest.fn();
            const wrapper = getWrapper({
                trackingProps: { modalTracking: { onLoadSharedLink: onLoadSharedLinkMock } },
            });
            wrapper.setProps({ sharedLink: { url: 'http://go', permissionLevel: 'canEdit' } });
            expect(onLoadSharedLinkMock).toHaveBeenCalledWith('canEdit');
        });

        test('should render an allShareRestrictionWarning message when it is available', () => {
            const SharingRestrictionWarning = <div className="test-class">Sharing is prohibited</div>;
            const wrapper = getWrapper({ allShareRestrictionWarning: SharingRestrictionWarning });

            wrapper.setState({ isFetching: false });

            expect(wrapper.find('.test-class')).toMatchSnapshot();
        });

        test('should render a default component in initial loading state', () => {
            const wrapper = getWrapper();
            wrapper.setState({ isFetching: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component when showing invite section expanded', () => {
            const wrapper = getWrapper();
            wrapper.setState({
                isFetching: false,
                isInviteSectionExpanded: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component FTUX based on enabled prop and state', () => {
            const wrapper = getWrapper({
                showCalloutForUser: true,
            });
            wrapper.setState({ shouldRenderFTUXTooltip: true });

            expect(wrapper).toMatchSnapshot();
        });

        test('should not render a default component FTUX when prop is false', () => {
            const wrapper = getWrapper({
                showCalloutForUser: false,
            });

            wrapper.setState({
                shouldRenderFTUXTooltip: true,
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
            const wrapper = getWrapper();
            wrapper.setState({ isFetching: false, isRemoveLinkConfirmModalOpen: true });
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
                item,
            });
            wrapper.setState({ isFetching: false });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with send invite error specified', () => {
            const errorNode = <span>Some Error</span>;
            const wrapper = getWrapper({
                canInvite: true,
                sendInvitesError: errorNode,
            });

            wrapper.setState({
                isFetching: false,
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
            });

            wrapper.setState({
                isFetching: false,
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
            });

            wrapper.setState({
                isFetching: false,
                isInviteSectionExpanded: false,
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with invitee permissions listed', () => {
            const wrapper = getWrapper({
                canInvite: true,
                submitting: false,
                inviteePermissions: ['Editor'],
            });
            wrapper.setState({ isFetching: false });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with upgrade CTA when showUpgradeOptions is enabled', () => {
            const wrapper = getWrapper({
                canInvite: true,
                showUpgradeOptions: true,
            });
            wrapper.setState({
                isFetching: false,
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
            });
            wrapper.setState({
                isEmailLinkSectionExpanded: false,
                isInviteSectionExpanded: false,
                sharedLinkLoaded: true,
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

        test('should render a default component with confirm remove collaborator modal open', () => {
            const wrapper = getWrapper({ canRemoveCollaborators: true, onRemoveCollaborator: jest.fn() });
            wrapper.setState({
                isFetching: false,
                isRemoveCollaboratorConfirmModalOpen: true,
                collaboratorToRemove: {
                    name: 'Collaborator a',
                    hasCustomAvatar: false,
                },
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a default component with collaborator list when showCollaboratorList state is true', () => {
            const collaborators = [
                { name: 'test a', hasCustomAvatar: false, isRemovable: false },
                { name: 'test b', hasCustomAvatar: false, isRemovable: true },
            ];

            const wrapper = getWrapper({
                collaboratorsList: { ...collaboratorsList, collaborators },
                canRemoveCollaborators: true,
                onRemoveCollaborator: jest.fn(),
            });
            wrapper.setState({ showCollaboratorList: true });

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('getInitialData()', () => {
        test('getInitialData is not called when item.type is null', () => {
            const getInitialDataStub = jest.fn();
            const item = { ...defaultItem, type: null, typedID: 'f_id' };

            getWrapper({
                item,
                getInitialData: getInitialDataStub,
            });

            expect(getInitialDataStub).toHaveBeenCalledTimes(0);
        });

        test('getInitialData is not called when item.typedID is null', () => {
            const getInitialDataStub = jest.fn();
            const item = {
                ...defaultItem,
                type: 'folder',
                typedID: null,
            };

            getWrapper({
                item,
                getInitialData: getInitialDataStub,
            });

            expect(getInitialDataStub).toHaveBeenCalledTimes(0);
        });

        test('getInitialData is called and getInitialDataCalled is set to true', () => {
            const getInitialDataStub = jest.fn().mockImplementation(() => Promise.resolve('test'));
            const item = {
                ...defaultItem,
                type: 'folder',
                typedID: 'f_id',
            };

            const wrapper = getWrapper({
                item,
                getInitialData: getInitialDataStub,
            });

            expect(getInitialDataStub).toHaveBeenCalled();
            expect(wrapper.state('getInitialDataCalled')).toBe(true);
        });
    });

    describe('handleFtuxCloseClick()', () => {
        const wrapper = getWrapper();
        wrapper.instance().handleFtuxCloseClick();
        expect(wrapper.state('shouldRenderFTUXTooltip')).toEqual(false);
    });

    describe('closeConfirmModal()', () => {
        test('should keep the state as closed when called', () => {
            const wrapper = getWrapper();

            wrapper.instance().closeConfirmModal();

            expect(wrapper.state('isRemoveLinkConfirmModalOpen')).toBe(false);
        });

        test('should set the state to closed if it was formerly open', () => {
            const wrapper = getWrapper();

            wrapper.instance().openConfirmModal();

            expect(wrapper.state('isRemoveLinkConfirmModalOpen')).toBe(true);

            wrapper.instance().closeConfirmModal();

            expect(wrapper.state('isRemoveLinkConfirmModalOpen')).toBe(false);
        });
    });

    describe('closeRemoveCollaboratorConfirmModal()', () => {
        test('should keep the state as closed when called', () => {
            const wrapper = getWrapper({
                canRemoveCollaborators: true,
                onRemoveCollaborator: jest.fn(),
            });

            wrapper.instance().closeRemoveCollaboratorConfirmModal();

            expect(wrapper.state('isRemoveCollaboratorConfirmModalOpen')).toBe(false);
            expect(wrapper.state('collaboratorToRemove')).toBe(null);
            expect(wrapper.state('shouldRenderFTUXTooltip')).toBe(false);
        });

        test('should set the state to closed when it was previously open', () => {
            const wrapper = getWrapper({
                canRemoveCollaborators: true,
                onRemoveCollaborator: jest.fn(),
            });

            wrapper.instance().openRemoveCollaboratorConfirmModal();

            expect(wrapper.state('isRemoveCollaboratorConfirmModalOpen')).toBe(true);
            expect(wrapper.state('collaboratorToRemove')).not.toBe(null);

            wrapper.instance().closeRemoveCollaboratorConfirmModal();

            expect(wrapper.state('isRemoveCollaboratorConfirmModalOpen')).toBe(false);
            expect(wrapper.state('collaboratorToRemove')).toBe(null);
        });

        test('should not set the state to open when canRemoveCollaborators prop is not defined', () => {
            const wrapper = getWrapper();

            wrapper.instance().openRemoveCollaboratorConfirmModal();

            expect(wrapper.state('isRemoveCollaboratorConfirmModalOpen')).toBe(false);
            expect(wrapper.state('collaboratorToRemove')).toBe(null);
        });
    });
});
