import React from 'react';
import sinon from 'sinon';

import ShareMenu, { OWNER_COOWNER_ONLY, INSUFFICIENT_PERMISSIONS } from '../ShareMenu';

const sandbox = sinon.sandbox.create();

describe('features/share/ShareMenu', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <ShareMenu
                canInvite
                canShare
                isDownloadAllowed
                isPreviewAllowed
                onGetSharedLinkSelect={sandbox.stub()}
                onInviteCollabSelect={sandbox.stub()}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render a Menu component with invite collab and get shared link options', () => {
        const wrapper = getWrapper({
            onGetSharedLinkSelect: sandbox.mock(),
            onInviteCollabSelect: sandbox.mock(),
            className: 'hello',
            'data-resin-prop': 'hey',
        });

        expect(wrapper.find('Menu').length).toBe(1);
        expect(wrapper.find('Menu').hasClass('hello')).toBe(true);
        expect(wrapper.find('Menu').prop('data-resin-prop')).toEqual('hey');
        expect(wrapper.find('MenuItem').length).toBe(2);
        expect(wrapper.find('IconInviteCollaborators').length).toBe(1);
        expect(wrapper.find('IconSharedLink').length).toBe(1);

        wrapper.find('.invite-collaborators').simulate('click');
        wrapper.find('.get-shared-link').simulate('click');
    });

    test('should disable "invite collaborators" option and render restricted icon when canInvite is false', () => {
        const wrapper = getWrapper({ canInvite: false });

        expect(wrapper.find('.invite-collaborators').prop('isDisabled')).toBe(true);
        expect(wrapper.find('IconCollaboratorsRestricted').length).toBe(1);
    });

    test('should disable "get shared link" option and render restricted icon when canShare is false', () => {
        const wrapper = getWrapper({ canShare: false });

        expect(
            wrapper
                .find('MenuItem')
                .at(1)
                .prop('isDisabled'),
        ).toBe(true);
        expect(wrapper.find('IconSharedLinkRestricted').length).toBe(1);
    });
    [
        // Owner Co owner only
        {
            inviteRestrictionCode: OWNER_COOWNER_ONLY,
            expectedMessage: 'boxui.shareMenu.ownerCoownerOnlyTooltip',
        },
        // Insufficient Permissions
        {
            inviteRestrictionCode: INSUFFICIENT_PERMISSIONS,
            expectedMessage: 'boxui.shareMenu.insufficientPermissionsTooltip',
        },
    ].forEach(({ inviteRestrictionCode, expectedMessage }) => {
        test('should display correct tooltip when user cannot invite', () => {
            const wrapper = getWrapper({
                inviteRestrictionCode,
                canInvite: false,
            });

            const message = wrapper.find('Tooltip').prop('text').props.id;
            expect(message).toEqual(expectedMessage);
        });
    });

    [
        // View and Download
        {
            isDownloadAllowed: true,
            isPreviewAllowed: true,
            expectedMessage: 'boxui.shareMenu.viewAndDownload',
        },
        // View Only
        {
            isDownloadAllowed: false,
            isPreviewAllowed: true,
            expectedMessage: 'boxui.shareMenu.viewOnly',
        },
        // Download Only
        {
            isDownloadAllowed: true,
            isPreviewAllowed: false,
            expectedMessage: 'boxui.shareMenu.downloadOnly',
        },
        // Shortcut Only
        {
            isDownloadAllowed: false,
            isPreviewAllowed: false,
            expectedMessage: 'boxui.shareMenu.shortcutOnly',
        },
    ].forEach(({ isDownloadAllowed, isPreviewAllowed, expectedMessage }) => {
        test('should display correct permissions for shared link', () => {
            const wrapper = getWrapper({
                isDownloadAllowed,
                isPreviewAllowed,
            });

            const message = wrapper
                .find('.get-shared-link .share-option-description')
                .find('FormattedMessage')
                .prop('id');
            expect(message).toEqual(expectedMessage);
        });
    });
});
