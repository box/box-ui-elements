import * as React from 'react';
import { shallow } from 'enzyme';
import {
    SIDEBAR_FORCE_KEY,
    SIDEBAR_FORCE_VALUE_CLOSED,
    SIDEBAR_FORCE_VALUE_OPEN,
    SidebarComponent as Sidebar,
} from '../Sidebar';
import LocalStore from '../../../utils/LocalStore';

jest.mock('../../common/async-load', () => () => 'LoadableComponent');
jest.mock('../../../utils/LocalStore');

describe('elements/content-sidebar/Sidebar', () => {
    const file = {
        id: 'id',
        file_version: {
            id: '123',
        },
    };

    const withDocgenFeature = {
        enabled: true,
        checkDocGenTemplate: jest.fn(),
        isDocGenTemplate: false,
    };

    const withOutDocgenFeature = {
        enabled: false,
        checkDocGenTemplate: jest.fn(),
        isDocGenTemplate: false,
    };

    const defaultProps = {
        file,
        location: { pathname: '/' },
        docGenSidebarProps: withOutDocgenFeature,
    };

    const getWrapper = props => shallow(<Sidebar {...defaultProps} {...props} />);

    beforeEach(() => {
        LocalStore.mockClear();
    });

    describe('componentDidMount', () => {
        test('should call checkDocGenTemplate if docgen is enabeld', () => {
            const wrapper = shallow(
                <Sidebar
                    file={file}
                    location={{ pathname: '/' }}
                    docGenSidebarProps={withDocgenFeature}
                    metadataSidebarProps={{ isFeatureEnabled: true }}
                />,
            );
            wrapper.instance();
            expect(withDocgenFeature.checkDocGenTemplate).toHaveBeenCalledTimes(1);
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
        test('should re-check whether a file is docgen template on file change', () => {
            const wrapper = shallow(
                <Sidebar
                    file={file}
                    location={{ pathname: '/' }}
                    docGenSidebarProps={withDocgenFeature}
                    metadataSidebarProps={{ isFeatureEnabled: true }}
                />,
            );
            wrapper.instance();
            wrapper.setProps({ file: { ...file, id: 'new-file' } });
            expect(withDocgenFeature.checkDocGenTemplate).toHaveBeenCalledTimes(2);
        });
        test('should redirect to dogen tab if the new file is a docgen template', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/activity/comments/1234',
                },
            };
            const wrapper = shallow(
                <Sidebar
                    location={{ pathname: '/' }}
                    file={file}
                    history={historyMock}
                    docGenSidebarProps={withDocgenFeature}
                    metadataSidebarProps={{ isFeatureEnabled: true }}
                />,
            );
            wrapper.instance();
            wrapper.setProps({
                file: { ...file, id: 'new-file' },
                docGenSidebarProps: {
                    ...withDocgenFeature,
                    isDocGenTemplate: true,
                },
            });
            expect(historyMock.push).toHaveBeenCalledWith('/docgen');
        });
        test('test should redirect to default route if new file is not a docgen template', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/activity/comments/1234',
                },
            };
            const wrapper = shallow(
                <Sidebar
                    location={{ pathname: '/docgen' }}
                    file={file}
                    history={historyMock}
                    docGenSidebarProps={{
                        ...withDocgenFeature,
                        isDocGenTemplate: true,
                    }}
                    metadataSidebarProps={{ isFeatureEnabled: true }}
                />,
            );
            wrapper.instance();
            wrapper.setProps({
                file: { ...file, id: 'new-file' },
                docGenSidebarProps: withDocgenFeature,
            });
            expect(historyMock.push).toHaveBeenCalledWith('/');
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
});
