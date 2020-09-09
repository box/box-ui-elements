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
                autofocusSharedLink={false}
                changeSharedLinkAccessLevel={sandbox.stub()}
                changeSharedLinkPermissionLevel={sandbox.stub()}
                intl={intl}
                item={defaultItem}
                itemType="file"
                onDismissTooltip={() => {}}
                showSharedLinkSettingsCallout
                tooltips={{}}
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

    test('should render proper dropdown override when viewing an editable box note', () => {
        const wrapper = getWrapper({
            item: {
                accessLevel: 'peopleInYourCompany',
                description: 'some description',
                extension: 'boxnote',
                id: 12345,
                name: 'text.boxnote',
                type: 'file',
                ...defaultItem,
            },
            sharedLink: {
                isEditAllowed: true,
                url: 'http://example.com/s/abc',
                isNewSharedLink: false,
            },
        });

        expect(wrapper).toMatchSnapshot();
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

    test('should render disabled create shared link message when item share is false and url is empty', () => {
        const sharedLink = { url: '', canChangeAccessLevel: true };
        const item = { grantedPermissions: { itemShare: false } };
        const wrapper = getWrapper({ sharedLink, item });
        const tooltip = wrapper.find('.usm-disabled-message-tooltip');

        expect(tooltip).toMatchSnapshot();
    });

    test('should render disabled remove shared link message when url is not empty and canChangeAccessLevel is false', () => {
        const sharedLink = { url: 'https://example.com/shared-link', canChangeAccessLevel: false };
        const wrapper = getWrapper({ sharedLink });
        const tooltip = wrapper.find('.usm-disabled-message-tooltip');

        expect(tooltip).toMatchSnapshot();
    });

    test.each`
        config                                | emailButtonExists | description
        ${undefined}                          | ${true}           | ${'should render email shared link button when config is undefined'}
        ${{ foo: 'bar' }}                     | ${true}           | ${'should render email shared link button when config does not contain showEmailSharedLinkForm'}
        ${{ showEmailSharedLinkForm: true }}  | ${true}           | ${'should render email shared link button when config.showEmailSharedLinkForm is true'}
        ${{ showEmailSharedLinkForm: false }} | ${false}          | ${'should not render email shared link button when config.showEmailSharedLinkForm is false'}
    `('$description', ({ config, emailButtonExists }) => {
        const sharedLink = { url: 'https://example.com/shared-link' };
        const wrapper = getWrapper({ config, sharedLink });
        expect(wrapper.exists('.email-shared-link-btn')).toBe(emailButtonExists);
    });

    describe('componentDidMount()', () => {
        test('should attempt shared link creation when component is mounted with initial, empty shared link data', () => {
            const sharedLink = { url: '', isNewSharedLink: false };
            const addSharedLink = jest.fn();

            const wrapper = getWrapper({
                addSharedLink,
                submitting: false,
                autoCreateSharedLink: true,
                sharedLink,
            });

            expect(addSharedLink).toBeCalledTimes(1);
            expect(wrapper.state().isAutoCreatingSharedLink).toBe(true);
        });

        test('should note attempt shared link creation when component is mounted with a shared link', () => {
            const sharedLink = { url: 'sftp://example.org/', isNewSharedLink: false };
            const addSharedLink = jest.fn();

            const wrapper = getWrapper({
                addSharedLink,
                submitting: false,
                autoCreateSharedLink: true,
                sharedLink,
            });

            expect(addSharedLink).toBeCalledTimes(0);
            expect(wrapper.state().isAutoCreatingSharedLink).toBe(false);
        });
    });

    describe('componentDidUpdate()', () => {
        afterEach(() => {
            global.navigator.clipboard = undefined;
        });

        test('should call addSharedLink when modal is triggered to create a URL', () => {
            const sharedLink = { url: '', isNewSharedLink: false };
            const addSharedLink = jest.fn();

            const wrapper = getWrapper({
                addSharedLink,
                submitting: true,
                autoCreateSharedLink: true,
                sharedLink,
            });

            expect(wrapper.state().isAutoCreatingSharedLink).toBe(false);

            wrapper.setProps({ submitting: false });

            expect(addSharedLink).toBeCalledTimes(1);
            expect(wrapper.state().isAutoCreatingSharedLink).toBe(true);

            wrapper.setProps({ sharedLink: { url: 'http://example.com/', isNewSharedLink: true } });

            expect(wrapper.state().isAutoCreatingSharedLink).toBe(false);
        });

        test('should not call addSharedLink when modal is triggered to fetch existing URL', () => {
            const sharedLink = { url: 'http://example.com/', isNewSharedLink: false };
            const addSharedLink = jest.fn();

            const wrapper = getWrapper({
                addSharedLink,
                submitting: true,
                autoCreateSharedLink: true,
                sharedLink,
            });

            expect(wrapper.state().isAutoCreatingSharedLink).toBe(false);

            wrapper.setProps({ submitting: false });

            expect(addSharedLink).toBeCalledTimes(0);
            expect(wrapper.state().isAutoCreatingSharedLink).toBe(false);
        });

        test('should handle attempt to copy when the clipboard API is available and request is successful', async () => {
            expect.assertions(6);
            const sharedLink = { url: '', isNewSharedLink: false };
            const addSharedLink = jest.fn();
            const onCopyInitMock = jest.fn();
            const onCopySuccessMock = jest.fn();
            const onCopyErrorMock = jest.fn();
            const writeTextSuccessMock = jest.fn(() => Promise.resolve());
            navigator.clipboard = {
                writeText: writeTextSuccessMock,
            };

            const wrapper = getWrapper({
                addSharedLink,
                autoCreateSharedLink: true,
                onCopyError: onCopyErrorMock,
                onCopyInit: onCopyInitMock,
                onCopySuccess: onCopySuccessMock,
                sharedLink,
                submitting: true,
                triggerCopyOnLoad: true,
            });

            wrapper.setProps({ submitting: false });
            wrapper.setProps({ sharedLink: { url: 'http://example.com/', isNewSharedLink: true } });

            await new Promise(r => setTimeout(r, 0));

            expect(onCopyInitMock).toBeCalledTimes(1);
            expect(writeTextSuccessMock).toBeCalledTimes(1);
            expect(onCopySuccessMock).toBeCalledTimes(1);
            expect(wrapper.find('TextInputWithCopyButton').prop('triggerCopyOnLoad')).toBe(true);
            expect(wrapper.state('isCopySuccessful')).toEqual(true);
            expect(onCopyErrorMock).toBeCalledTimes(0);
        });

        test('should only initiate copy when we specifically request a copy to be triggered', () => {
            const sharedLink = { url: '', isNewSharedLink: false };
            const addSharedLink = jest.fn();
            const onCopyInitMock = jest.fn();
            const onCopySuccessMock = jest.fn();
            const onCopyErrorMock = jest.fn();
            const writeTextSuccessMock = jest.fn(() => Promise.resolve());
            navigator.clipboard = {
                writeText: writeTextSuccessMock,
            };

            const wrapper = getWrapper({
                addSharedLink,
                autoCreateSharedLink: true,
                autofocusSharedLink: true,
                onCopyError: onCopyErrorMock,
                onCopyInit: onCopyInitMock,
                onCopySuccess: onCopySuccessMock,
                sharedLink,
                submitting: true,
                triggerCopyOnLoad: false,
            });

            wrapper.setProps({ submitting: false });
            wrapper.setProps({ sharedLink: { url: 'http://example.com/', isNewSharedLink: true } });

            expect(onCopyInitMock).toBeCalledTimes(0);
            expect(writeTextSuccessMock).toBeCalledTimes(0);
            expect(onCopySuccessMock).toBeCalledTimes(0);
            expect(onCopyErrorMock).toBeCalledTimes(0);
        });

        test('should handle attempt to copy when the clipboard request fails', async () => {
            expect.assertions(6);
            const sharedLink = { url: '', isNewSharedLink: false };
            const addSharedLink = jest.fn();
            const onCopyInitMock = jest.fn();
            const onCopySuccessMock = jest.fn();
            const onCopyErrorMock = jest.fn();
            const writeTextRejectMock = jest.fn(() => Promise.reject());
            navigator.clipboard = {
                writeText: writeTextRejectMock,
            };

            const wrapper = getWrapper({
                addSharedLink,
                autoCreateSharedLink: true,
                onCopyError: onCopyErrorMock,
                onCopyInit: onCopyInitMock,
                onCopySuccess: onCopySuccessMock,
                sharedLink,
                submitting: true,
                triggerCopyOnLoad: true,
            });

            wrapper.setProps({ submitting: false });
            wrapper.setProps({ sharedLink: { url: 'http://example.com/', isNewSharedLink: true } });

            await new Promise(r => setTimeout(r, 0));

            expect(onCopyInitMock).toBeCalledTimes(1);
            expect(writeTextRejectMock).toBeCalledTimes(1);
            expect(onCopySuccessMock).toBeCalledTimes(0);
            expect(onCopyErrorMock).toBeCalledTimes(1);
            expect(wrapper.find('TextInputWithCopyButton').prop('triggerCopyOnLoad')).toBe(false);
            expect(wrapper.state('isCopySuccessful')).toEqual(false);
        });
    });
});
