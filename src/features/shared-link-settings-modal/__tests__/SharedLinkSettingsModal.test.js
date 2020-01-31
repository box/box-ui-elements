import React from 'react';
import sinon from 'sinon';

import SharedLinkSettingsModal from '../SharedLinkSettingsModal';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-settings-modal/SharedLinkSettingsModal', () => {
    const canChangeVanityName = true;
    const vanityName = 'vanity';
    const serverURL = 'box.com/';

    const canChangePassword = true;
    const isPasswordAvailable = true;
    const isPasswordEnabled = false;

    const canChangeExpiration = true;

    const isDownloadAvailable = true;
    const canChangeDownload = true;
    const isDownloadEnabled = true;

    const directLink = 'box.com/download';
    const isDirectLinkAvailable = true;
    const isDirectLinkUnavailableDueToDownloadSettings = true;
    const isDirectLinkUnavailableDueToAccessPolicy = true;

    const getWrapper = (props = {}) =>
        shallow(
            <SharedLinkSettingsModal
                onSubmit={sandbox.stub()}
                canChangeVanityName={canChangeVanityName}
                item={{
                    bannerPolicy: {
                        body: 'test',
                    },
                    classification: 'internal',
                    grantedPermissions: {
                        itemShare: true,
                    },
                    hideCollaborators: false,
                    id: 12345,
                    name: 'My Example Folder',
                    type: 'folder',
                    typedID: 'd_12345',
                }}
                vanityName={vanityName}
                serverURL={serverURL}
                canChangePassword={canChangePassword}
                isPasswordAvailable={isPasswordAvailable}
                isPasswordEnabled={isPasswordEnabled}
                canChangeExpiration={canChangeExpiration}
                isDownloadAvailable={isDownloadAvailable}
                canChangeDownload={canChangeDownload}
                isDownloadEnabled={isDownloadEnabled}
                directLink={directLink}
                isDirectLinkAvailable={isDirectLinkAvailable}
                isDirectLinkUnavailableDueToDownloadSettings={isDirectLinkUnavailableDueToDownloadSettings}
                isDirectLinkUnavailableDueToAccessPolicy={isDirectLinkUnavailableDueToAccessPolicy}
                {...props}
            />,
        );

    describe('componentDidUpdate()', () => {
        test('should update errors in state when error props change', () => {
            const wrapper = getWrapper({ expirationError: 'first error' });

            wrapper.setProps({ expirationError: 'new error' });

            expect(wrapper.state('expirationError')).toEqual('new error');
        });

        test('should not update errors in state when error props do not change', () => {
            const wrapper = getWrapper({ expirationError: 'first error' });

            wrapper.setState({ expirationError: undefined });

            wrapper.setProps({ directLink: 'hi' }); // unrelated prop

            expect(wrapper.state('expirationError')).toBeFalsy();
        });
    });

    describe('onSubmit()', () => {
        test('should preventDefault and call props.onSubmit', () => {
            const expirationDate = new Date();
            const formState = {
                expirationDate,
                isDownloadEnabled: true,
                isExpirationEnabled: true,
                isPasswordEnabled: true,
                password: 'password',
                vanityName: 'vanity',
            };
            const wrapper = getWrapper({
                onSubmit: sandbox.mock().withArgs({
                    expirationTimestamp: expirationDate.getTime(),
                    isDownloadEnabled: true,
                    isExpirationEnabled: true,
                    isPasswordEnabled: true,
                    password: 'password',
                    vanityName: 'vanity',
                }),
            });
            wrapper.setState(formState);

            wrapper.instance().onSubmit({ preventDefault: sandbox.mock() });
        });
    });

    describe('onVanityNameChange()', () => {
        test('should update state.vanityName', () => {
            const wrapper = getWrapper({
                vanityNameError: 'hi',
            });

            wrapper.instance().onVanityNameChange({
                target: { value: 'new val' },
            });

            expect(wrapper.state('vanityName')).toEqual('new val');
            expect(wrapper.state('vanityNameError')).toBeFalsy();
        });
    });

    describe('onPasswordChange()', () => {
        test('should update state.password', () => {
            const wrapper = getWrapper({ passwordError: 'hey' });

            wrapper.instance().onPasswordChange({
                target: { value: 'new val' },
            });

            expect(wrapper.state('password')).toEqual('new val');
            expect(wrapper.state('passwordError')).toBeFalsy();
        });
    });

    describe('onPasswordCheckboxChange()', () => {
        test('should update state.isPasswordEnabled', () => {
            const wrapper = getWrapper();

            wrapper.instance().onPasswordCheckboxChange({
                target: { checked: true },
            });

            expect(wrapper.state('isPasswordEnabled')).toBe(true);
        });
    });

    describe('onExpirationDateChange()', () => {
        test('should set state.expirationDate', () => {
            const newDate = new Date();

            const wrapper = getWrapper({ expirationError: 'hi' });

            wrapper.instance().onExpirationDateChange(newDate);

            expect(wrapper.state('expirationDate')).toEqual(newDate);
            expect(wrapper.state('expirationError')).toBeFalsy();
        });
    });

    describe('onExpirationCheckboxChange()', () => {
        test('should set state.isExpirationEnabled', () => {
            const wrapper = getWrapper();

            wrapper.instance().onExpirationCheckboxChange({ target: { checked: true } });

            expect(wrapper.state('isExpirationEnabled')).toBe(true);
        });
    });

    describe('onAllowDownloadChange()', () => {
        test('should set state.isDownloadEnabled', () => {
            const wrapper = getWrapper();

            wrapper.instance().onAllowDownloadChange({ target: { checked: true } });

            expect(wrapper.state('isDownloadEnabled')).toBe(true);
        });
    });

    describe('renderVanityNameSection()', () => {
        test('should render a VanityNameSection', () => {
            const wrapper = getWrapper();

            wrapper.setState({
                vanityName: 'another vanity name',
                vanityNameError: 'error',
            });

            const VanitySection = shallow(wrapper.instance().renderVanityNameSection());
            expect(VanitySection.length).toBe(1);
            expect(VanitySection.prop('canChangeVanityName')).toEqual(canChangeVanityName);
            expect(VanitySection.prop('vanityName')).toEqual('another vanity name');
            expect(VanitySection.prop('serverURL')).toEqual(serverURL);
            expect(VanitySection.prop('onChange')).toEqual(wrapper.instance().onVanityNameChange);
            expect(VanitySection.prop('error')).toEqual('error');
        });

        test('should not render VanityNameSection when hideVanityNameSection is true', () => {
            const wrapper = getWrapper({
                hideVanityNameSection: true,
            });

            const VanityNameSection = wrapper.instance().renderVanityNameSection();

            expect(VanityNameSection).toBe(null);
        });
    });

    describe('renderPasswordSection()', () => {
        test('should render a PasswordSection', () => {
            const wrapper = getWrapper({
                isPasswordEnabled: false,
            });

            wrapper.setState({
                password: 'another password',
                passwordError: 'error',
                isPasswordEnabled: true,
            });

            const PasswordSection = shallow(wrapper.instance().renderPasswordSection());

            expect(PasswordSection.length).toBe(1);
            expect(PasswordSection.prop('canChangePassword')).toEqual(canChangePassword);
            expect(PasswordSection.prop('isPasswordAvailable')).toEqual(isPasswordAvailable);
            expect(PasswordSection.prop('isPasswordEnabled')).toBe(true);
            expect(PasswordSection.prop('isPasswordInitiallyEnabled')).toBe(false);
            expect(PasswordSection.prop('onPasswordChange')).toEqual(wrapper.instance().onPasswordChange);
            expect(PasswordSection.prop('onCheckboxChange')).toEqual(wrapper.instance().onPasswordCheckboxChange);
            expect(PasswordSection.prop('password')).toEqual('another password');
            expect(PasswordSection.prop('error')).toEqual('error');
        });
    });

    describe('renderExpirationSection()', () => {
        test('should render an ExpirationSection', () => {
            const expirationDate = new Date('11/7/17');

            const wrapper = getWrapper({
                expirationTimestamp: 123,
            });

            wrapper.setState({
                expirationDate,
                expirationError: 'error',
                isExpirationEnabled: true,
            });

            const section = wrapper.find('ExpirationSection');
            expect(section.length).toBe(1);
            expect(section.prop('canChangeExpiration')).toEqual(canChangeExpiration);
            expect(section.prop('expirationDate')).toEqual(expirationDate);
            expect(section.prop('isExpirationEnabled')).toBe(true);
            expect(section.prop('onCheckboxChange')).toEqual(wrapper.instance().onExpirationCheckboxChange);
            expect(section.prop('onExpirationDateChange')).toEqual(wrapper.instance().onExpirationDateChange);
            expect(section.prop('error')).toEqual('error');
        });
    });

    describe('renderAllowDownloadSection()', () => {
        test('should render an AllowDownloadSection', () => {
            const wrapper = getWrapper();

            wrapper.setState({ isDownloadEnabled: false });

            const section = wrapper.find('AllowDownloadSection');
            expect(section.length).toBe(1);
            expect(section.prop('isDownloadAvailable')).toEqual(isDownloadAvailable);
            expect(section.prop('isDownloadEnabled')).toBe(false);
            expect(section.prop('canChangeDownload')).toEqual(canChangeDownload);
            expect(section.prop('directLink')).toEqual(directLink);
            expect(section.prop('isDirectLinkAvailable')).toEqual(isDirectLinkAvailable);
            expect(section.prop('isDirectLinkUnavailableDueToDownloadSettings')).toEqual(
                isDirectLinkUnavailableDueToDownloadSettings,
            );
            expect(section.prop('isDirectLinkUnavailableDueToAccessPolicy')).toEqual(
                isDirectLinkUnavailableDueToAccessPolicy,
            );
            expect(section.prop('onChange')).toEqual(wrapper.instance().onAllowDownloadChange);
        });
    });

    describe('renderModalTitle()', () => {
        const wrapper = getWrapper();
        const title = shallow(wrapper.instance().renderModalTitle());
        expect(title).toMatchSnapshot();
    });

    describe('render()', () => {
        test('should render a Modal, form, close button, and save button', () => {
            const wrapper = getWrapper();

            const modal = wrapper.find('Modal');
            expect(modal.length).toBe(1);

            const form = wrapper.find('form');
            expect(form.length).toBe(1);
            expect(form.prop('onSubmit')).toEqual(wrapper.instance().onSubmit);

            const closeBtn = wrapper.find('ModalActions').find('Button');
            expect(closeBtn.length).toBe(1);

            const saveBtn = wrapper.find('ModalActions').find('PrimaryButton');
            expect(saveBtn.length).toBe(1);
        });

        test('should set loading state when props.submitting is true', () => {
            const wrapper = getWrapper({
                submitting: true,
            });

            const closeBtn = wrapper.find('ModalActions').find('Button');
            expect(closeBtn.prop('isDisabled')).toBe(true);

            const saveBtn = wrapper.find('ModalActions').find('PrimaryButton');
            expect(saveBtn.prop('isDisabled')).toBe(true);
            expect(saveBtn.prop('isLoading')).toBe(true);
        });

        test('should show inaccessible settings notice when at least one setting is inaccessible', () => {
            const wrapper = getWrapper({
                canChangeDownload: false,
            });

            expect(wrapper.find('InlineNotice').length).toBe(1);
        });

        test('should disable save button when all settings are inaccessible', () => {
            const wrapper = getWrapper({
                canChangeDownload: false,
                canChangeExpiration: false,
                canChangePassword: false,
                canChangeVanityName: false,
            });

            expect(wrapper.find('PrimaryButton').prop('isDisabled')).toBe(true);
        });
    });
});
