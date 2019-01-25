import React from 'react';
import sinon from 'sinon';

import { SharedLinkBase as SharedLink } from '../SharedLink';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from '../constants';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-modal/SharedLink', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <SharedLink
                accessLevel={PEOPLE_WITH_LINK}
                allowedAccessLevels={{
                    [PEOPLE_WITH_LINK]: true,
                    [PEOPLE_IN_COMPANY]: true,
                    [PEOPLE_IN_ITEM]: true,
                }}
                canRemoveLink
                changeAccessLevel={() => {}}
                enterpriseName="enterprise"
                intl={{ formatMessage: () => 'message' }}
                itemName="filename.gif"
                itemType="folder"
                onCopySuccess={() => {}}
                removeLink={() => {}}
                sharedLink="http://box.com"
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render an IconExpirationInverted with a tooltip when expiration exists', () => {
        const wrapper = getWrapper({ expiration: 1234 });

        expect(wrapper.find('.shared-link-icons').find('Tooltip').length).toBe(1);
        expect(wrapper.find('IconExpirationInverted').length).toBe(1);
    });

    test('should not render an IconExpirationInverted when expiration does not exist', () => {
        const wrapper = getWrapper({ expiration: undefined });

        expect(wrapper.find('IconExpirationInverted').length).toBe(0);
    });

    test('should render settings icon when handler is provided', () => {
        const wrapper = getWrapper({
            onSettingsClick: sandbox.mock(),
            settingsButtonProps: { 'data-resin-target': 'settings' },
        });

        const btn = wrapper.find('.shared-link-settings-btn');
        btn.simulate('click');

        expect(btn).toMatchSnapshot();
    });

    test('should not render settings icon when handler not provided', () => {
        const wrapper = getWrapper({ onSettingsClick: undefined });

        expect(wrapper.find('IconSettingInverted').length).toBe(0);
    });

    test('should render a TextInputWithCopyButton correctly', () => {
        const copyButtonProps = { 'data-resin-thing': 'copy' };
        const wrapper = getWrapper({
            copyButtonProps,
        });

        const input = wrapper.find('TextInputWithCopyButton');
        expect(input).toMatchSnapshot();
    });

    test('should render a SharedLinkAccess', () => {
        const accessMenuButtonProps = {
            'data-resin-thing': 'menu',
        };
        const removeLinkButtonProps = {
            'data-resin-thing': 'remove',
        };

        const wrapper = getWrapper({
            accessDropdownMenuProps: { constrainToWindow: true },
            accessMenuButtonProps,
            removeLinkButtonProps,
        });

        const section = wrapper.find('SharedLinkAccess');
        expect(section).toMatchSnapshot();
    });
});
