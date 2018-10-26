import React from 'react';
import { shallow } from 'enzyme';
import ContentOpenWith from '../ContentOpenWith';

jest.mock('lodash/uniqueId', () => () => 'uniqueId');

describe('components/ContentOpenWith/ContentOpenWith', () => {
    const fileId = '1234';
    let wrapper;
    let instance;
    const getWrapper = props => shallow(<ContentOpenWith {...props} />);

    beforeEach(() => {
        wrapper = getWrapper({ fileId });
        instance = wrapper.instance();
        global.console.error = jest.fn();
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
            expect(instance.setState).toHaveBeenCalledWith({ isLoading: true });
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
            const instance = getWrapper({
                fileId: '1234',
                language: 'en-US',
            }).instance();
            instance.setState = jest.fn();
            instance.api = api;

            instance.fetchOpenWithData();
            expect(openWithStub).toHaveBeenCalledWith(
                '1234',
                'en-US',
                expect.any(Function),
                expect.any(Function),
            );
        });
    });

    describe('fetchOpenWithSuccessHandler()', () => {
        test('should set the state with the new integrations and disable loading', () => {
            const mockIntegrations = ['Adobe', 'Google'];
            instance.setState = jest.fn();

            instance.fetchOpenWithSuccessHandler(mockIntegrations);
            expect(instance.setState).toHaveBeenCalledWith({
                integrations: mockIntegrations,
                isLoading: false,
            });
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
        it('should open a new window, set state, unload, title, and kick off the integration execution', () => {
            instance.window.open = jest.fn().mockReturnValue({
                onunload: null,
                document: {
                    title: null,
                },
            });
            const executeStub = jest.fn();
            const api = {
                getAppIntegrationsAPI: () => ({ execute: executeStub }),
            };
            instance.api = api;
            instance.setState = jest.fn();
            const displayIntegration = {
                appIntegrationId: '1',
                displayName: 'Adobe Sign',
            };

            instance.onIntegrationClick(displayIntegration);
            expect(instance.window.open).toBeCalled();
            expect(typeof instance.integrationWindow.onunload).toEqual(
                'function',
            );
            expect(instance.integrationWindow.document.title).toEqual(
                displayIntegration.displayName,
            );
            expect(instance.setState).toHaveBeenCalledWith({
                shouldRenderLoadingIntegrationPortal: true,
                shouldRenderErrorIntegrationPortal: false,
            });
            expect(api.getAppIntegrationsAPI().execute).toBeCalled();
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
        test('should set the post data in state for a POST integration', () => {
            const executeData = {
                method: 'POST',
                url: 'foo.com/bar',
            };
            instance.setState = jest.fn();

            instance.executeIntegrationSuccessHandler(executeData);
            expect(instance.setState).toBeCalledWith({
                executePostData: executeData,
            });
        });
        test('should throw an error if there is no integration window available in the GET case', () => {
            const executeData = {
                method: 'GET',
                url: 'foo.com/bar',
            };
            instance.integrationWindow = false;
            instance.executeIntegrationErrorHandler = jest.fn();

            instance.executeIntegrationSuccessHandler(executeData);
            expect(instance.executeIntegrationErrorHandler).toBeCalled();
        });
        test('should call the execute handler and null the integrationWindow', () => {
            instance.onExecute = jest.fn();
            const executeData = {
                method: 'GET',
                url: 'foo.com/bar',
            };
            instance.integrationWindow = {
                location: null,
                opener: 'url',
            };

            instance.executeIntegrationSuccessHandler(executeData);
            expect(instance.onExecute).toBeCalled();
            expect(instance.integrationWindow).toEqual(null);
        });
        test('should throw an error in the default case', () => {
            const executeData = {
                method: 'CRYPTO',
                url: 'foo.com/bar',
            };
            instance.executeIntegrationErrorHandler = jest.fn();

            instance.executeIntegrationSuccessHandler(executeData);
            expect(instance.executeIntegrationErrorHandler).toBeCalled();
        });
    });

    describe('onExecuteFormSubmit()', () => {
        test('should call the execute handler and clear out the form state data', () => {
            instance.onExecute = jest.fn();
            instance.setState = jest.fn();

            instance.onExecuteFormSubmit();
            expect(instance.onExecute).toBeCalled();
            expect(instance.setState).toBeCalledWith({ executePostData: null });
        });
    });

    describe('onExecute()', () => {
        test('should call the user provided callback and clear the portal loading state', () => {});
        const propFunction = jest.fn();
        const id = '1';
        instance = getWrapper({ onExecute: propFunction }).instance();
        instance.setState = jest.fn();
        instance.executeId = id;

        instance.onExecute();
        expect(propFunction).toBeCalledWith(id);
        expect(instance.executeId).toEqual(null);
        expect(instance.setState).toBeCalledWith({
            shouldRenderLoadingIntegrationPortal: false,
        });
    });

    describe('executeIntegrationErrorHandler()', () => {
        test('should call the user provided callback and set the portal state', () => {
            const propFunction = jest.fn();
            instance = getWrapper({ onError: propFunction }).instance();
            instance.setState = jest.fn();
            const error = new Error();

            instance.executeIntegrationErrorHandler(error);
            expect(propFunction).toBeCalledWith(error);
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
            const instance = getWrapper({ fileId }).instance();
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
