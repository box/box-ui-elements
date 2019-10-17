import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import messages from '../../common/messages';
import { ContentOpenWithComponent as ContentOpenWith } from '../ContentOpenWith';
import { BOX_EDIT_INTEGRATION_ID, BOX_EDIT_SFC_INTEGRATION_ID } from '../../../constants';
import BoxToolsInstallMessage from '../BoxToolsInstallMessage';

jest.mock('lodash/uniqueId', () => () => 'uniqueId');

const ADOBE_INTEGRATION_ID = '1234';
const BLACKLISTED_ERROR_MESSAGE_KEY = 'boxToolsBlacklistedError';
const BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY = 'boxToolsInstallErrorMessage';

describe('elements/content-open-with/ContentOpenWith', () => {
    const fileId = '1234';
    const token = '4321';
    let wrapper;
    let instance;
    const getWrapper = props => shallow(<ContentOpenWith {...props} />);

    beforeEach(() => {
        wrapper = getWrapper({ fileId, token });
        instance = wrapper.instance();
        jest.spyOn(global.console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('componentDidMount()', () => {
        test('should fetch Open With data', () => {
            instance.fetchOpenWithData = jest.fn();

            instance.componentDidMount();
            expect(instance.fetchOpenWithData).toHaveBeenCalled();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should reset loading state and get Open With data if the file ID has changed', () => {
            instance.fetchOpenWithData = jest.fn();
            instance.setState = jest.fn();

            instance.componentDidUpdate({ fileId: '4321' });
            expect(instance.fetchOpenWithData).toHaveBeenCalled();
            expect(instance.setState).toHaveBeenCalledWith({ ...instance.initialState });
        });
    });

    describe('isBoxEditIntegration()', () => {
        test('should determine if the integration is a Box Edit integration', () => {
            expect(instance.isBoxEditIntegration(ADOBE_INTEGRATION_ID)).toBe(false);
            expect(instance.isBoxEditIntegration(BOX_EDIT_INTEGRATION_ID)).toBe(true);
            expect(instance.isBoxEditIntegration(BOX_EDIT_SFC_INTEGRATION_ID)).toBe(true);
        });
    });

    describe('isBoxEditSFCIntegration()', () => {
        test('should determine if the integration is a Box Edit SFC integration', () => {
            expect(instance.isBoxEditSFCIntegration(ADOBE_INTEGRATION_ID)).toBe(false);
            expect(instance.isBoxEditSFCIntegration(BOX_EDIT_INTEGRATION_ID)).toBe(false);
            expect(instance.isBoxEditSFCIntegration(BOX_EDIT_SFC_INTEGRATION_ID)).toBe(true);
        });
    });

    describe('fetchOpenWithData()', () => {
        const fileStub = jest.fn();
        const openWithStub = jest.fn();
        const api = {
            getFileAPI: () => ({
                getFile: fileStub,
            }),
            getOpenWithAPI: () => ({
                getOpenWithIntegrations: openWithStub,
            }),
        };

        test('should should fetch Open With integrations', () => {
            instance = getWrapper({
                fileId: '1234',
                language: 'en-US',
            }).instance();
            instance.setState = jest.fn();
            instance.api = api;

            instance.fetchOpenWithData();
            expect(openWithStub).toHaveBeenCalledWith('1234', expect.any(Function), expect.any(Function));
        });
    });

    describe('fetchOpenWithSuccessHandler()', () => {
        let mockIntegrations = [];
        let boxEditIntegration = {};
        const extension = 'pdf';

        beforeEach(() => {
            instance.setState = jest.fn();
            mockIntegrations = [
                {
                    isDisabled: false,
                    name: 'Adobe',
                    appIntegrationId: '2',
                    disabledReasons: [],
                },
                {
                    isDisabled: false,
                    name: 'Google',
                    appIntegrationId: '1',
                    disabledReasons: [],
                },
            ];
            boxEditIntegration = {
                isDisabled: false,
                name: 'Open',
                appIntegrationId: BOX_EDIT_INTEGRATION_ID,
                disabledReasons: [],
            };
        });

        test('should set the state with the new integrations and disable loading', async () => {
            instance.getIntegrationFileExtension = jest.fn();

            await instance.fetchOpenWithSuccessHandler(mockIntegrations);

            expect(instance.setState).toHaveBeenCalledWith({
                integrations: mockIntegrations,
                isLoading: false,
            });
            expect(instance.getIntegrationFileExtension).not.toBeCalled();
        });

        test('should set the disabled reason if we are unable to get the extension before setting state', async () => {
            instance.getIntegrationFileExtension = jest.fn().mockRejectedValue(new Error('error'));
            instance.isBoxEditAvailable = jest.fn();
            instance.canOpenExtensionWithBoxEdit = jest.fn();

            await instance.fetchOpenWithSuccessHandler([boxEditIntegration]);
            expect(instance.setState).toBeCalled();
            expect(instance.isBoxEditAvailable).not.toBeCalled();
            expect(instance.canOpenExtensionWithBoxEdit).not.toBeCalled();
        });

        test('should get the file extension and check box edit for availability and openability before setting state', async () => {
            const integrationWithExtension = {
                ...boxEditIntegration,
                extension,
            };

            instance.getIntegrationFileExtension = jest.fn().mockResolvedValue({ extension });
            instance.isBoxEditAvailable = jest.fn().mockResolvedValue(true);
            instance.canOpenExtensionWithBoxEdit = jest.fn().mockResolvedValue(true);

            await instance.fetchOpenWithSuccessHandler([...mockIntegrations, boxEditIntegration]);

            expect(instance.setState).toBeCalledWith({
                integrations: [...mockIntegrations, integrationWithExtension],
                isLoading: false,
            });
            expect(instance.isBoxEditAvailable).toBeCalled();
            expect(instance.canOpenExtensionWithBoxEdit).toBeCalled();
        });

        test('should set the disabled reason if Box Tools is not available before setting state', async () => {
            instance.getIntegrationFileExtension = jest.fn().mockResolvedValue({ extension });
            instance.isBoxEditAvailable = jest.fn().mockRejectedValue(new Error(BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY));
            instance.canOpenExtensionWithBoxEdit = jest.fn().mockResolvedValue();

            await instance.fetchOpenWithSuccessHandler([boxEditIntegration]);

            expect(instance.setState).toBeCalledWith({
                integrations: [
                    {
                        ...boxEditIntegration,
                        isDisabled: true,
                        // eslint-disable-next-line
                        disabledReasons: [<BoxToolsInstallMessage />],
                    },
                ],
                isLoading: false,
            });
        });

        test('should set the disabled reason if the file type is black listed by box tools before setting state', async () => {
            instance.getIntegrationFileExtension = jest.fn().mockResolvedValue({ extension });
            instance.isBoxEditAvailable = jest.fn().mockResolvedValue();
            instance.canOpenExtensionWithBoxEdit = jest
                .fn()
                .mockRejectedValue(new Error(BLACKLISTED_ERROR_MESSAGE_KEY));

            await instance.fetchOpenWithSuccessHandler([boxEditIntegration]);

            expect(instance.setState).toBeCalledWith({
                integrations: [
                    {
                        ...boxEditIntegration,
                        isDisabled: true,
                        // eslint-disable-next-line
                        disabledReasons: [<FormattedMessage {...messages.boxToolsBlacklistedError} />],
                    },
                ],
                isLoading: false,
            });
        });

        test('should set the default disabled reason if there was a failure for an unknown reason', async () => {
            instance.getIntegrationFileExtension = jest.fn().mockRejectedValue(new Error('foo'));
            await instance.fetchOpenWithSuccessHandler([boxEditIntegration]);

            expect(instance.setState).toBeCalledWith({
                integrations: [
                    {
                        ...boxEditIntegration,
                        isDisabled: true,
                        // eslint-disable-next-line
                        disabledReasons: [<FormattedMessage {...messages.executeIntegrationOpenWithErrorHeader} />],
                    },
                ],
                isLoading: false,
            });
        });
    });

    describe('getIntegrationFileExtension()', () => {
        test('should get the file extension', () => {
            const getFileExtensionStub = jest.fn();
            instance.api = {
                getFileAPI: () => ({ getFileExtension: getFileExtensionStub }),
            };

            instance.getIntegrationFileExtension();

            expect(getFileExtensionStub).toBeCalled();
        });
    });

    describe('isBoxEditAvailable()', () => {
        test('should resolve with result of box edit', async () => {
            let checkBoxEditAvailabilityStub = jest.fn().mockResolvedValueOnce();
            instance.api = {
                getBoxEditAPI: () => ({ checkBoxEditAvailability: checkBoxEditAvailabilityStub }),
            };

            const result = await instance.isBoxEditAvailable();
            expect(result).toBe(undefined);

            checkBoxEditAvailabilityStub = jest.fn().mockRejectedValue('Not Available!');

            try {
                await instance.isBoxEditAvailable();
            } catch (error) {
                expect(typeof error.message).toBe('string');
            }
        });
    });

    describe('canOpenExtensionWithBoxEdit()', () => {
        test('should resolve with result of box edit', async () => {
            let getAppForExtensionStub = jest.fn().mockResolvedValueOnce();
            instance.api = {
                getBoxEditAPI: () => ({ getAppForExtension: getAppForExtensionStub }),
            };

            const result = await instance.canOpenExtensionWithBoxEdit('pdf');
            expect(result).toBe(undefined);

            getAppForExtensionStub = jest.fn().mockRejectedValue('blacklisted!');

            try {
                await instance.canOpenExtensionWithBoxEdit('js');
            } catch (error) {
                expect(typeof error.message).toBe('string');
            }
        });
    });

    describe('fetchErrorHandler()', () => {
        test('should set the error state', () => {
            const mockError = new Error();
            instance.setState = jest.fn();

            instance.fetchErrorHandler(mockError);
            expect(instance.setState).toHaveBeenCalledWith({
                fetchError: mockError,
                isLoading: false,
            });
        });
    });

    describe('onIntegrationClick()', () => {
        let api;
        let displayIntegration;
        beforeEach(() => {
            const executeStub = jest.fn();
            api = {
                getAppIntegrationsAPI: () => ({ execute: executeStub }),
            };

            displayIntegration = {
                appIntegrationId: '1',
                displayName: 'Adobe Sign',
            };

            instance.setState = jest.fn();
            instance.api = api;
        });

        it('should open a new window, set state, unload, title, and kick off the integration execution', () => {
            instance.window.open = jest.fn().mockReturnValue({
                onunload: null,
                document: {
                    title: null,
                },
            });

            instance.onIntegrationClick(displayIntegration);
            expect(instance.window.open).toBeCalled();
            expect(typeof instance.integrationWindow.onunload).toEqual('function');
            expect(instance.integrationWindow.document.title).toEqual(displayIntegration.displayName);
            expect(instance.setState).toHaveBeenCalledWith({
                shouldRenderLoadingIntegrationPortal: true,
                shouldRenderErrorIntegrationPortal: false,
            });
            expect(api.getAppIntegrationsAPI().execute).toBeCalled();
        });

        it('should not perform any window management for a box edit integration', () => {
            instance.isBoxEditIntegration = jest.fn().mockReturnValue(true);
            instance.executeBoxEditErrorHandler = jest.fn();

            instance.onIntegrationClick(displayIntegration);
            expect(api.getAppIntegrationsAPI().execute).toBeCalled();
            expect(instance.setState).not.toBeCalled();
            expect(api.getAppIntegrationsAPI().execute).toBeCalledWith(
                expect.any(String),
                expect.any(String),
                expect.any(Function),
                instance.executeBoxEditErrorHandler,
            );
        });
    });

    describe('cleanupIntegrationWindow()', () => {
        it('should clear portal related state', () => {
            instance.setState = jest.fn();

            instance.cleanupIntegrationWindow();
            expect(instance.setState).toHaveBeenCalledWith({
                shouldRenderLoadingIntegrationPortal: false,
                shouldRenderErrorIntegrationPortal: false,
            });
        });
    });

    describe('executeIntegrationSuccessHandler()', () => {
        const id = 3;
        const executeData = {
            method: 'GET',
            url: 'foo.com/bar',
        };

        beforeEach(() => {
            instance.isBoxEditIntegration = jest.fn();
            instance.executeBoxEditSuccessHandler = jest.fn();
            instance.executeOnlineIntegrationSuccessHandler = jest.fn();
            instance.onExecute = jest.fn();
        });

        test('should invoke the box edit success handler if we executed a box edit integration', () => {
            instance.isBoxEditIntegration.mockReturnValue(true);

            instance.executeIntegrationSuccessHandler(id, executeData);

            expect(instance.executeBoxEditSuccessHandler).toBeCalledWith(id, executeData);
        });

        test('should invoke the online success handler if we executed an online integration', () => {
            instance.isBoxEditIntegration.mockReturnValue(false);

            instance.executeIntegrationSuccessHandler(id, executeData);

            expect(instance.executeOnlineIntegrationSuccessHandler).toBeCalledWith(executeData);
            expect(instance.executeBoxEditSuccessHandler).not.toBeCalled();
        });

        test('should invoke the execute callback', () => {
            instance.onExecute = jest.fn();

            instance.executeIntegrationSuccessHandler(id, executeData);
            expect(instance.onExecute).toBeCalledWith(id);
        });
    });

    describe('executeOnlineIntegrationSuccessHandler()', () => {
        test('should set the post data in state for a POST integration', () => {
            const executeData = {
                method: 'POST',
                url: 'foo.com/bar',
            };
            instance.setState = jest.fn();

            instance.executeOnlineIntegrationSuccessHandler(executeData);
            expect(instance.setState).toBeCalledWith({
                executePostData: executeData,
            });
        });
        test('should  null the integrationWindow', () => {
            instance.onExecute = jest.fn();
            const executeData = {
                method: 'GET',
                url: 'foo.com/bar',
            };
            instance.integrationWindow = {
                location: null,
                opener: 'url',
            };

            instance.executeOnlineIntegrationSuccessHandler(executeData);
            expect(instance.integrationWindow).toEqual(null);
        });
        test('should throw an error in the default case', () => {
            const executeData = {
                method: 'CRYPTO',
                url: 'foo.com/bar',
            };
            instance.executeIntegrationErrorHandler = jest.fn();

            instance.executeOnlineIntegrationSuccessHandler(executeData);
            expect(instance.executeIntegrationErrorHandler).toBeCalled();
        });
    });

    describe('executeBoxEditSuccessHandler()', () => {
        test('should use box edit to open the file', () => {
            const openFileStub = jest.fn().mockResolvedValue('open');
            const authCode = 'abcde';
            instance.api = {
                getBoxEditAPI: () => ({ openFile: openFileStub }),
            };
            instance.isBoxEditSFCIntegration = jest.fn().mockReturnValue(true);

            const executeData = {
                url: `www.box.com/execute?file_id=1&auth_code=${authCode}&other_param=foo`,
            };

            instance.executeBoxEditSuccessHandler('1234', executeData);

            expect(openFileStub).toBeCalledWith(fileId, {
                data: {
                    auth_code: authCode,
                    token,
                    token_scope: 'file',
                },
            });
        });

        test('should call the onError callback when Box Tools cannot open a file ', async () => {
            const onError = jest.fn();
            const error = { error: 'error' };
            wrapper = getWrapper({ fileId, token, onError });
            instance = wrapper.instance();
            const openFileStub = jest.fn().mockRejectedValue(error);
            const authCode = 'abcde';
            instance.api = {
                getBoxEditAPI: () => ({ openFile: openFileStub }),
            };

            instance.isBoxEditSFCIntegration = jest.fn().mockReturnValue(true);

            const executeData = {
                url: `www.box.com/execute?file_id=1&auth_code=${authCode}&other_param=foo`,
            };

            await instance.executeBoxEditSuccessHandler('1234', executeData);

            expect(onError).toBeCalledWith(error, 'execute_integrations_error', { error });
        });
    });

    describe('onExecuteFormSubmit()', () => {
        test('should clear out the form state data', () => {
            instance.setState = jest.fn();
            instance.onExecuteFormSubmit();
            expect(instance.setState).toBeCalledWith({ executePostData: null });
        });
    });

    describe('onExecute()', () => {
        test('should call the user provided callback and clear the portal loading state', () => {});
        const propFunction = jest.fn();
        const id = '1';
        instance = getWrapper({ onExecute: propFunction }).instance();
        instance.setState = jest.fn();

        instance.onExecute(id);
        expect(propFunction).toBeCalledWith(id);
        expect(instance.setState).toBeCalledWith({
            shouldRenderLoadingIntegrationPortal: false,
        });
    });

    describe('executeIntegrationErrorHandler()', () => {
        test('should call the user provided callback and set the portal state', () => {
            const propFunction = jest.fn();
            instance = getWrapper({ onError: propFunction }).instance();
            const errorCode = 'foo';
            instance.setState = jest.fn();
            const error = new Error();

            instance.executeIntegrationErrorHandler(error, errorCode);
            expect(propFunction).toBeCalledWith(error, errorCode, expect.any(Object));
            expect(instance.setState).toBeCalledWith({
                shouldRenderLoadingIntegrationPortal: false,
                shouldRenderErrorIntegrationPortal: true,
            });
        });
    });

    describe('getDisplayIntegration()', () => {
        test('should return null iff there is not one integration', () => {
            instance.setState({ integrations: null });
            const result = instance.getDisplayIntegration();
            expect(result).toEqual(null);

            instance.setState({ integrations: ['Adobe', 'Google'] });
            const multipleResult = instance.getDisplayIntegration();
            expect(multipleResult).toEqual(null);

            instance.setState({ integrations: [] });
            const emptyResult = instance.getDisplayIntegration();
            expect(emptyResult).toEqual(null);
        });

        test('should return the sole integration as the display integration', () => {
            instance = getWrapper({ fileId }).instance();
            instance.setState({ integrations: ['Adobe'] });
            const result = instance.getDisplayIntegration();
            expect(result).toEqual('Adobe');
        });
    });

    describe('render()', () => {
        test('should render the Open With button when loading', () => {
            expect(wrapper).toMatchSnapshot();
        });

        test('should render the Open With button if there is one or fewer integrations', () => {
            instance.setState({
                integrations: ['Adobe'],
                isLoading: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render the Open With dropdown if there is more than one integration', () => {
            instance.setState({
                integrations: ['Adobe', 'Google Suite'],
                isLoading: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render the PortalContainer if the integration is loading', () => {
            instance.setState({
                integrations: ['Adobe', 'Google Suite'],
                shouldRenderLoadingIntegrationPortal: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render the PortalContainer if the integration is errored', () => {
            instance.setState({
                integrations: ['Adobe', 'Google Suite'],
                shouldRenderErrorIntegrationPortal: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render the ExecuteForm if we have data to post', () => {
            instance.setState({
                integrations: ['Adobe'],
                executePostData: {
                    url: 'foo.com',
                    params: [{ foo: 'bar' }],
                },
            });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
