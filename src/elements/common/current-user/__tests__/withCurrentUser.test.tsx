import React, { Component } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ComponentWithCurrentUser, CurrentUserState, WithCurrentUserProps } from '../withCurrentUser';
import { withCurrentUser } from '../index';
import type { User } from '../../../../common/types/core';
// @ts-ignore no ts defintion
import messages from '../../messages';

const { defaultErrorMaskSubHeaderMessage, currentUserErrorHeaderMessage } = messages;

type WrappedProps = Partial<WithCurrentUserProps>;
type WrapperType = ShallowWrapper<WrappedProps, CurrentUserState, Component & ComponentWithCurrentUser>;

jest.mock('../../api-context/withAPIContext', () => (div: React.Component) => div);

describe('elements/common/current-user/withCurrentUser', () => {
    const usersAPI = {
        getUser: jest.fn(),
    };

    const api = {
        getUsersAPI: () => usersAPI,
    };

    const file = {
        id: 'id',
    };

    const MockComponent = (props: WithCurrentUserProps) => <div {...props} />;
    const WrappedComponent = withCurrentUser(MockComponent);

    const getWrapper = (props: WrappedProps = {}): WrapperType =>
        shallow(<WrappedComponent api={api} file={file} {...props} />);

    const currentUser: User = {
        id: 'foo',
        name: 'Test User',
        type: 'user',
    };

    let instance: React.Component<{}, {}, {}> & ComponentWithCurrentUser;
    let wrapper: WrapperType;

    describe('fetchCurrentUser()', () => {
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should invoke setState() directly if user parameter is not missing', () => {
            instance.setState = jest.fn();
            instance.fetchCurrentUser(currentUser);

            expect(instance.setState).toBeCalledWith({
                currentUser,
                currentUserError: undefined,
            });
        });

        test('should get the user', () => {
            instance.fetchCurrentUser();

            expect(usersAPI.getUser).toBeCalled();
        });
    });

    describe('fetchCurrentUserSuccessCallback()', () => {
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.setState = jest.fn();
        });

        test('should set the feedItems in the state', () => {
            instance.fetchCurrentUserSuccessCallback(currentUser);
            expect(instance.setState).toBeCalledWith({
                currentUser,
                currentUserError: undefined,
            });
        });
    });

    describe('fetchCurrentUserErrorCallback()', () => {
        beforeEach(() => {
            wrapper = getWrapper({ file });
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
            instance.fetchCurrentUser = jest.fn();
        });

        test('should set a maskError if there is an error in fetching the current user', () => {
            instance.fetchCurrentUserErrorCallback({ name: 'Error', message: 'Not Found' }, '404');
            const inlineErrorState = wrapper.state().currentUserError.maskError;

            expect(typeof currentUserErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(currentUserErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
        });

        test('should set the current user error and call the error callback', () => {
            instance.setState = jest.fn();
            instance.fetchCurrentUserErrorCallback({ name: 'Error', message: 'Server Error', status: 500 }, '500');
            expect(instance.setState).toBeCalledWith({
                currentUser: undefined,
                currentUserError: expect.any(Object),
            });
            expect(instance.errorCallback).toBeCalled();
        });
    });
});
