import React from 'react';
import { shallow } from 'enzyme';
import ContentOpenWith from '../ContentOpenWith';

describe('components/ContentOpenWith/ContentOpenWith', () => {
    const fileId = '1234';
    const getWrapper = props => shallow(<ContentOpenWith {...props} />);

    describe('componentDidMount()', () => {
        it('should fetch Open With data', () => {
            const instance = getWrapper({ fileId }).instance();
            instance.fetchOpenWithData = jest.fn();

            instance.componentDidMount();
            expect(instance.fetchOpenWithData).toHaveBeenCalled();
        });
    });

    describe('componentDidUpdate()', () => {
        it('should reset loading state and get Open With data if the file ID has changed', () => {
            const instance = getWrapper({ fileId }).instance();
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

        it('should should fetch Open With integrations', () => {
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
        it('should set the state with the new integrations and disable loading', () => {
            const instance = getWrapper({ fileId }).instance();
            const mockIntegrations = ['Adobe', 'Google'];
            instance.setState = jest.fn();

            instance.fetchOpenWithSuccessHandler(mockIntegrations);
            expect(instance.setState).toHaveBeenCalledWith({
                integrations: mockIntegrations,
                isLoading: false,
            });
        });
    });

    describe('fetchErrorCallback()', () => {
        it('should set the error state', () => {
            const instance = getWrapper({ fileId }).instance();
            const mockError = new Error();
            instance.setState = jest.fn();

            instance.fetchErrorCallback(mockError);
            expect(instance.setState).toHaveBeenCalledWith({
                fetchError: mockError,
                isLoading: false,
            });
        });
    });

    describe('getDisplayIntegration()', () => {
        it('should return null iff there is not one integration', () => {
            const instance = getWrapper({ fileId }).instance();
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

        it('should return the sole integration as the display integration', () => {
            const instance = getWrapper({ fileId }).instance();
            instance.setState({ integrations: ['Adobe'] });
            const result = instance.getDisplayIntegration();
            expect(result).toEqual('Adobe');
        });
    });

    describe('render()', () => {
        it('should render the loading button when loading', () => {
            const wrapper = getWrapper({ fileId });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render the Open With button', () => {
            const wrapper = getWrapper({ fileId });
            const instance = wrapper.instance();
            instance.setState({
                integrations: ['Adobe'],
                isLoading: false,
            });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
