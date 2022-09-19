import React from 'react';
import { shallow } from 'enzyme';
import {
    SidebarComponent,
    SIDEBAR_FORCE_KEY,
    SIDEBAR_FORCE_VALUE_CLOSED,
    SIDEBAR_FORCE_VALUE_OPEN,
    SidebarComponent as Sidebar,
} from '../Sidebar';
import messages from '../../common/messages';
import LocalStore from '../../../utils/LocalStore';

const { defaultErrorMaskSubHeaderMessage, currentUserErrorHeaderMessage } = messages;

jest.mock('../../common/async-load', () => () => 'LoadableComponent');
jest.mock('../../../utils/LocalStore');

describe('elements/content-sidebar/Sidebar', () => {
    const usersAPI = {
        getUser: jest.fn(),
    };
    const api = {
        getUsersAPI: () => usersAPI,
    };
    const file = {
        id: 'id',
        file_version: {
            id: '123',
        },
    };
    let currentUser = {
        id: 'foo',
    };

    const getWrapper = props => shallow(<Sidebar api={api} file={file} location={{ pathname: '/' }} {...props} />);

    beforeEach(() => {
        LocalStore.mockClear();
    });

    describe('componentDidMount()', () => {
        let wrapper;
        let instance;
        currentUser = {
            id: '123',
        };
        beforeEach(() => {
            jest.spyOn(SidebarComponent.prototype, 'fetchCurrentUser');
            wrapper = getWrapper({
                currentUser,
            });
            instance = wrapper.instance();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should fetch the current user', () => {
            expect(instance.fetchCurrentUser).toHaveBeenCalledWith(currentUser);
        });
    });

    describe('componentDidUpdate', () => {
        beforeEach(() => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null),
            }));
        });

        test('should update if a user-initiated location change occurred', () => {
            const wrapper = getWrapper({ location: { pathname: '/activity' } });
            const instance = wrapper.instance();
            instance.setForcedByLocation = jest.fn();

            expect(wrapper.state('isDirty')).toBe(false);
            expect(instance.setForcedByLocation).not.toHaveBeenCalled();

            wrapper.setProps({ location: { pathname: '/details' } });

            expect(wrapper.state('isDirty')).toBe(true);
            expect(instance.setForcedByLocation).toHaveBeenCalled();
        });

        test('should not set isDirty if an app-initiated location change occurred', () => {
            const wrapper = getWrapper({ location: { pathname: '/activity' } });

            expect(wrapper.state('isDirty')).toBe(false);

            wrapper.setProps({ location: { pathname: '/details', state: { silent: true } } });

            expect(wrapper.state('isDirty')).toBe(false);
        });

        test('should set the forced open state if the location state is present', () => {
            const wrapper = getWrapper({ location: { pathname: '/' } });
            const instance = wrapper.instance();
            instance.isForced = jest.fn();

            wrapper.setProps({ location: { pathname: '/details' } });
            expect(instance.isForced).toHaveBeenCalledWith(); // Getter for render

            wrapper.setProps({ location: { pathname: '/details/inner', state: { open: true, silent: true } } });
            expect(instance.isForced).toHaveBeenCalledWith(); // Getter for render

            wrapper.setProps({ location: { pathname: '/', state: { open: true } } });
            expect(instance.isForced).toHaveBeenCalledWith(true);

            wrapper.setProps({ location: { pathname: '/', state: { open: false } } });
            expect(instance.isForced).toHaveBeenCalledWith(false);
        });
    });

    describe('handleVersionHistoryClick', () => {
        test('should handle url with deeplink', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/activity/comments/1234',
                },
            };

            const preventDefaultMock = jest.fn();

            const event = {
                preventDefault: preventDefaultMock,
            };

            const wrapper = getWrapper({ history: historyMock, file: { id: '1234', file_version: { id: '4567' } } });
            const instance = wrapper.instance();

            instance.handleVersionHistoryClick(event);

            expect(preventDefaultMock).toHaveBeenCalled();
            expect(historyMock.push).toHaveBeenCalledWith('/activity/versions/4567');
        });

        test('should handle url without deeplink', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/details',
                },
            };

            const preventDefaultMock = jest.fn();

            const event = {
                preventDefault: preventDefaultMock,
            };

            const wrapper = getWrapper({ history: historyMock, file: { id: '1234', file_version: { id: '4567' } } });
            const instance = wrapper.instance();

            instance.handleVersionHistoryClick(event);

            expect(preventDefaultMock).toHaveBeenCalled();
            expect(historyMock.push).toHaveBeenCalledWith('/details/versions/4567');
        });
    });

    describe('isForced', () => {
        test('returns the current value from the localStore', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
            }));

            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(instance.store.getItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(instance.isForced()).toEqual(SIDEBAR_FORCE_VALUE_OPEN);
        });

        test('returns an empty value from localStore if the value is unset', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => null),
            }));

            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(instance.store.getItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(instance.isForced()).toEqual(null);
        });

        test('sets and then returns the value to localStore if passed in', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.isForced(SIDEBAR_FORCE_VALUE_OPEN);

            expect(instance.store.setItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY, SIDEBAR_FORCE_VALUE_OPEN);
            expect(instance.store.getItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(instance.isForced()).toEqual(SIDEBAR_FORCE_VALUE_OPEN);
        });
    });

    describe('isForcedSet', () => {
        test('should return true if the value is not null', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.isForced = jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN);

            expect(instance.isForcedSet()).toBe(true);
        });

        test('should return false if the value is null', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.isForced = jest.fn(() => null);

            expect(instance.isForcedSet()).toBe(false);
        });
    });

    describe('render', () => {
        test.each`
            forced                        | isDefaultOpen | expected
            ${SIDEBAR_FORCE_VALUE_CLOSED} | ${true}       | ${false}
            ${SIDEBAR_FORCE_VALUE_CLOSED} | ${false}      | ${false}
            ${SIDEBAR_FORCE_VALUE_OPEN}   | ${true}       | ${true}
            ${SIDEBAR_FORCE_VALUE_OPEN}   | ${false}      | ${true}
            ${null}                       | ${true}       | ${true}
            ${null}                       | ${false}      | ${false}
        `(
            'should render the open state correctly with forced set to $forced and isDefaultOpen set to $isDefaultOpen',
            ({ expected, forced, isDefaultOpen }) => {
                LocalStore.mockImplementationOnce(() => ({
                    getItem: jest.fn(() => forced),
                    setItem: jest.fn(() => forced),
                }));

                const wrapper = getWrapper({ isDefaultOpen });

                expect(wrapper.hasClass('bcs-is-open')).toBe(expected);
            },
        );

        test('should not render SidebarNav when hasNav is false', () => {
            const wrapper = getWrapper({ hasNav: false });

            expect(wrapper.exists('SidebarNav')).toBe(false);
        });
    });

    describe('refresh()', () => {
        test.each([true, false])('should call panel refresh with the provided boolean', shouldRefreshCache => {
            const instance = getWrapper().instance();
            const refresh = jest.fn();
            instance.sidebarPanels = { current: { refresh } };

            instance.refresh(shouldRefreshCache);

            expect(refresh).toHaveBeenCalledWith(shouldRefreshCache);
        });
    });

    describe('fetchCurrentUser()', () => {
        let instance;
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
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
        let instance;
        let wrapper;

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
        let instance;
        let wrapper;

        beforeEach(() => {
            wrapper = getWrapper({ file });
            instance = wrapper.instance();
            instance.errorCallback = jest.fn();
            instance.fetchCurrentUser = jest.fn();
        });

        test('should set a maskError if there is an error in fetching the current user', () => {
            instance.fetchCurrentUserErrorCallback();
            const inlineErrorState = wrapper.state().currentUserError.maskError;
            expect(typeof currentUserErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(currentUserErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
        });

        test('should set the current user error and call the error callback', () => {
            instance.setState = jest.fn();
            instance.fetchCurrentUserErrorCallback({ status: 500 });
            expect(instance.setState).toBeCalledWith({
                currentUser: undefined,
                currentUserError: expect.any(Object),
            });
            expect(instance.errorCallback).toBeCalled();
        });
    });
});
