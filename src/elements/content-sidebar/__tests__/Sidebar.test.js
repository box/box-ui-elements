import React from 'react';
import { shallow } from 'enzyme';
import LocalStore from '../../../utils/LocalStore';
import {
    SIDEBAR_FORCE_KEY,
    SIDEBAR_FORCE_VALUE_CLOSED,
    SIDEBAR_FORCE_VALUE_OPEN,
    SidebarComponent as Sidebar,
} from '../Sidebar';

jest.mock('../../common/async-load', () => () => 'LoadableComponent');
jest.mock('../../../utils/LocalStore');

describe('elements/content-sidebar/Sidebar', () => {
    const annotatorContextProps = {
        getAnnotationsMatchPath: jest.fn(),
        getAnnotationsPath: jest.fn(),
    };

    const feedAPI = {
        addAnnotation: jest.fn(),
        feedItems: jest.fn(),
        getCachedItems: jest.fn(),
        deleteAnnotation: jest.fn(),
    };

    const api = {
        getFeedAPI: () => feedAPI,
    };

    const currentUser = {
        id: 'foo',
    };

    const file = {
        id: 'id',
        file_version: {
            id: '123',
        },
    };

    const getWrapper = props =>
        shallow(<Sidebar api={api} file={file} location={{ pathname: '/' }} {...annotatorContextProps} {...props} />);

    beforeEach(() => {
        LocalStore.mockClear();
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

        test.each`
            condition                                          | prevActiveAnnotationId | activeAnnotationId | isAnnotationsPath | expectedCount
            ${'annotation ids are the same'}                   | ${'123'}               | ${'123'}           | ${true}           | ${0}
            ${'annotation ids are different'}                  | ${'123'}               | ${'456'}           | ${true}           | ${1}
            ${'annotation deselected on annotations path'}     | ${'123'}               | ${null}            | ${true}           | ${1}
            ${'annotation deselected not on annotations path'} | ${'123'}               | ${null}            | ${false}          | ${0}
            ${'annotation selected not on annotations path'}   | ${null}                | ${'123'}           | ${false}          | ${1}
            ${'annotation selected on annotations path'}       | ${null}                | ${'123'}           | ${true}           | ${1}
        `(
            'should call updateActiveAnnotation $expectedCount times if $condition',
            ({ prevActiveAnnotationId, activeAnnotationId, isAnnotationsPath, expectedCount }) => {
                const wrapper = getWrapper({ annotatorState: { activeAnnotationId: prevActiveAnnotationId } });

                wrapper.instance().updateActiveAnnotation = jest.fn();
                annotatorContextProps.getAnnotationsMatchPath.mockReturnValue(isAnnotationsPath);

                wrapper.setProps({ annotatorState: { activeAnnotationId } });

                expect(wrapper.instance().updateActiveAnnotation).toHaveBeenCalledTimes(expectedCount);
            },
        );

        test.each`
            annotation   | expectedCount
            ${{}}        | ${1}
            ${undefined} | ${0}
        `(
            'should call addAnnotation $expectedCount times if annotation changed to $annotation',
            ({ annotation, expectedCount }) => {
                const wrapper = getWrapper();
                wrapper.instance().addAnnotation = jest.fn();
                wrapper.setProps({ annotatorState: { annotation } });

                expect(wrapper.instance().addAnnotation).toHaveBeenCalledTimes(expectedCount);
            },
        );
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
    });

    describe('updateActiveAnnotation()', () => {
        test.each`
            activeAnnotationId | fileVersionId | location                                    | expectedPath                       | expectedState
            ${'234'}           | ${'456'}      | ${{ pathname: '/' }}                        | ${'/activity/annotations/456/234'} | ${{ open: true }}
            ${'234'}           | ${undefined}  | ${{ pathname: '/' }}                        | ${'/activity/annotations/123/234'} | ${{ open: true }}
            ${null}            | ${'456'}      | ${{ pathname: '/' }}                        | ${'/activity/annotations/456'}     | ${undefined}
            ${null}            | ${'456'}      | ${{ pathname: '/', state: { foo: 'bar' } }} | ${'/activity/annotations/456'}     | ${{ foo: 'bar' }}
            ${'234'}           | ${'456'}      | ${{ pathname: '/', state: { foo: 'bar' } }} | ${'/activity/annotations/456/234'} | ${{ foo: 'bar', open: true }}
        `(
            'should set location path based on match param fileVersionId=$fileVersionId and activeAnnotationId=$activeAnnotationId',
            ({ activeAnnotationId, fileVersionId, location, expectedPath, expectedState }) => {
                const annotatorState = {
                    activeAnnotationId,
                };
                annotatorContextProps.getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId } });
                annotatorContextProps.getAnnotationsPath.mockReturnValue(expectedPath);
                const history = { push: jest.fn(), replace: jest.fn() };

                const wrapper = getWrapper({ annotatorState, history, location });
                const instance = wrapper.instance();

                instance.updateActiveAnnotation();

                expect(history.push).toHaveBeenCalledWith({ pathname: expectedPath, state: expectedState });
            },
        );
    });

    describe('addAnnotation()', () => {
        test('should throw if no user', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(() => instance.addAnnotation()).toThrow('Bad box user!');
        });

        test.each`
            title                                                             | isOpen   | isPending | isAnnotationsPath | hasItems | expectedAddCount | expectedRefreshCount
            ${'add annotation and refresh sidebar for pending annotation'}    | ${true}  | ${true}   | ${true}           | ${true}  | ${1}             | ${1}
            ${'refresh sidebar for pending annotation'}                       | ${false} | ${true}   | ${true}           | ${true}  | ${1}             | ${0}
            ${'add annotation but not refresh if not annotation path'}        | ${true}  | ${true}   | ${false}          | ${true}  | ${1}             | ${0}
            ${'not add annotation but refresh sidebar if cache has no items'} | ${true}  | ${true}   | ${true}           | ${false} | ${0}             | ${1}
            ${'add annotation and refresh sidebar for completed annotation'}  | ${true}  | ${false}  | ${true}           | ${true}  | ${1}             | ${1}
        `(
            'should $title',
            ({ isOpen, isPending, isAnnotationsPath, hasItems, expectedAddCount, expectedRefreshCount }) => {
                const annotatorStateMock = {
                    action: isPending ? 'create_start' : null,
                    annotation: {},
                    meta: {
                        requestId: '123',
                    },
                };

                const wrapper = getWrapper({ annotatorState: annotatorStateMock, currentUser });
                const instance = wrapper.instance();

                annotatorContextProps.getAnnotationsMatchPath.mockReturnValueOnce(isAnnotationsPath);
                feedAPI.getCachedItems.mockReturnValueOnce({ items: hasItems });
                instance.refresh = jest.fn();
                instance.getIsOpen = jest.fn().mockReturnValueOnce(isOpen);

                instance.addAnnotation();

                expect(feedAPI.addAnnotation).toHaveBeenCalledTimes(expectedAddCount);
                if (expectedAddCount) {
                    expect(feedAPI.addAnnotation).toBeCalledWith(
                        file,
                        currentUser,
                        annotatorStateMock.annotation,
                        annotatorStateMock.meta.requestId,
                        isPending,
                    );
                }
                expect(instance.refresh).toHaveBeenCalledTimes(expectedRefreshCount);
            },
        );
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
