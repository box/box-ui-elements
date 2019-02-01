import React from 'react';
import sinon from 'sinon';

import SharedLinkSection from '../SharedLinkSection';

const sandbox = sinon.sandbox.create();

describe('features/unified-share-modal/SharedLinkSection', () => {
    const intl = { formatMessage: sandbox.spy() };
    const defaultItem = {
        grantedPermissions: {
            itemShare: true,
        },
    };

    const getWrapper = (props = {}) =>
        shallow(
            <SharedLinkSection
                changeSharedLinkAccessLevel={sandbox.stub()}
                changeSharedLinkPermissionLevel={sandbox.stub()}
                intl={intl}
                item={defaultItem}
                itemType="file"
                showSharedLinkSettingsCallout
                {...props}
            />,
        );

    test('should render default component with shared link', () => {
        expect(
            getWrapper({
                sharedLink: {
                    accessLevel: 'peopleInYourCompany',
                    canChangeAccessLevel: true,
                    enterpriseName: 'Box',
                    expirationTimestamp: 0,
                    url: 'https://example.com/shared-link',
                },
            }),
        ).toMatchSnapshot();
    });

    test('should render default component with no sharedLink', () => {
        expect(
            getWrapper({
                sharedLink: {
                    url: '',
                },
            }),
        ).toMatchSnapshot();
    });

    test('should render a default component when there is a shared link but user lacks permission to toggle off', () => {
        const wrapper = getWrapper({
            sharedLink: {
                accessLevel: 'peopleInYourCompany',
                canChangeAccessLevel: false,
                enterpriseName: 'Box',
                expirationTimestamp: 0,
                url: 'https://example.com/shared-link',
            },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render default components with proper tooltip state while submitting request', () => {
        const wrapper = getWrapper({
            sharedLink: { url: '' },
            submitting: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should account for shared link expirations being set', () => {
        const wrapper = getWrapper({
            sharedLink: {
                accessLevel: 'peopleInYourCompany',
                canChangeAccessLevel: true,
                enterpriseName: 'Box',
                expirationTimestamp: 1519404618000,
                url: 'https://example.com/shared-link',
            },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render settings link when handler is provided and shared link is enabled', () => {
        const wrapper = getWrapper({
            onSettingsClick: jest.fn(),
            sharedLink: {
                accessLevel: 'peopleInYourCompany',
                canChangeAccessLevel: true,
                enterpriseName: 'Box',
                expirationTimestamp: 0,
                url: 'https://example.com/shared-link',
            },
            trackingProps: {
                sharedLinkSettingsButtonProps: {
                    'data-resin-target': 'settings',
                },
            },
        });

        const btn = wrapper.find('.shared-link-settings-btn');
        btn.simulate('click');

        expect(btn).toMatchSnapshot();
    });

    test('should not render settings link when handler not provided', () => {
        const wrapper = getWrapper({
            sharedLink: {
                accessLevel: 'peopleInYourCompany',
                canChangeAccessLevel: true,
                enterpriseName: 'Box',
                expirationTimestamp: 0,
                url: 'https://example.com/shared-link',
            },
            onSettingsClick: undefined,
        });

        expect(wrapper.find('.shared-link-settings-btn').length).toBe(0);
    });

    test('should render without SharedLinkPermissionMenu if access level is "people in item"', () => {
        const wrapper = getWrapper({
            sharedLink: {
                accessLevel: 'peopleInThisItem',
                canChangeAccessLevel: true,
                enterpriseName: 'Box',
                expirationTimestamp: 0,
                url: 'https://example.com/shared-link',
            },
        });

        expect(wrapper).toMatchSnapshot();
    });
    [
        {
            isDownloadSettingAvailable: true,
        },
        {
            isDownloadSettingAvailable: false,
        },
    ].forEach(({ isDownloadSettingAvailable }) => {
        test('should render proper list of permission options based on the the download setting availability', () => {
            const wrapper = getWrapper({
                sharedLink: {
                    accessLevel: 'peopleInYourCompany',
                    canChangeAccessLevel: true,
                    enterpriseName: 'Box',
                    isDownloadSettingAvailable,
                    expirationTimestamp: 0,
                    url: 'https://example.com/shared-link',
                },
            });

            expect(wrapper).toMatchSnapshot();
        });
    });

    test('should auto focus input when autofocus shared link on a new shared link', () => {
        const wrapper = getWrapper({
            autofocusSharedLink: true,
            sharedLink: {
                url: 'http://example.org/abc',
                isNewSharedLink: true,
            },
        });

        expect(wrapper.find('TextInputWithCopyButton').prop('autofocus')).toBe(true);
    });

    test('should auto focus input when autofocus shared link and should trigger animate on load', () => {
        const wrapper = getWrapper({
            autofocusSharedLink: true,
            sharedLink: {
                url: 'http://example.org/abc',
                isNewSharedLink: false,
            },
            triggerCopyOnLoad: true,
        });

        expect(wrapper.find('TextInputWithCopyButton').prop('autofocus')).toBe(true);
    });

    test('should not auto focus input when only the autofocusSharedLink prop is specified', () => {
        const wrapper = getWrapper({
            autofocusSharedLink: true,
            sharedLink: {
                url: 'http://example.org/abc',
            },
        });

        expect(wrapper.find('TextInputWithCopyButton').prop('autofocus')).toBe(false);
    });

    test('should not auto focus if autofocusSharedLink is specificed, but the shared link is old', () => {
        const wrapper = getWrapper({
            autofocusSharedLink: true,
            sharedLink: {
                url: 'http://example.org/abc',
            },
            triggerCopyOnLoad: false,
        });

        expect(wrapper.find('TextInputWithCopyButton').prop('autofocus')).toBe(false);
    });

    test('should not auto focus if autofocusSharedLink is specificed, but the shared link is old', () => {
        const wrapper = getWrapper({
            autofocusSharedLink: true,
            sharedLink: {
                url: 'http://example.org/abc',
                isNewSharedLink: false,
            },
        });

        expect(wrapper.find('TextInputWithCopyButton').prop('autofocus')).toBe(false);
    });
});
