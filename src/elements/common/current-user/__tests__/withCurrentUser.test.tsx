import React, { Component } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import type { ElementsXhrError } from '../../../../common/types/api';
import withCurrentUser, { ComponentWithCurrentUser, CurrentUserState, WithCurrentUserProps } from '../withCurrentUser';
// @ts-ignore no ts defintion
import messages from '../../messages';

const { defaultErrorMaskSubHeaderMessage, currentUserErrorHeaderMessage } = messages;

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

    type MockComponentProps = WithCurrentUserProps & {
        api: typeof api;
        file: typeof file;
    };

    const MockComponent: React.FC<MockComponentProps> = () => <div />;
    const WrappedComponent = withCurrentUser<MockComponentProps>(MockComponent);
    type WrappedProps = Partial<React.ComponentProps<typeof WrappedComponent>>;
    type WrapperType = ShallowWrapper<WrappedProps, CurrentUserState, Component & ComponentWithCurrentUser>;

    const getWrapper = (props: WrappedProps = {}): WrapperType =>
        shallow(<WrappedComponent api={api} file={file} onError={jest.fn()} {...props} />);

    const currentUser = {
        id: 'foo',
        name: 'Foo User',
        type: 'user',
    } as const;

    const createError = (status: number): ElementsXhrError => ({
        code: 'error',
        context_info: {},
        help_url: '',
        message: 'Request failed',
        request_id: 'request-id',
        status,
        type: 'error',
    });

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
            instance.fetchCurrentUserErrorCallback(createError(404), '404');
            const inlineErrorState = wrapper.state().currentUserError.maskError;

            expect(typeof currentUserErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(currentUserErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
        });

        test('should set the current user error and call the error callback', () => {
            instance.setState = jest.fn();
            instance.fetchCurrentUserErrorCallback(createError(500), '500');
            expect(instance.setState).toBeCalledWith({
                currentUser: undefined,
                currentUserError: expect.any(Object),
            });
            expect(instance.errorCallback).toBeCalled();
        });
    });
});
