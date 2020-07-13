import * as React from 'react';
import { shallow } from 'enzyme';
import withSidebarAnnotations from '../withSidebarAnnotations';

describe('elements/content-sidebar/withSidebarAnnotations', () => {
    const TestComponent = props => <div {...props} />;
    const WrappedComponent = withSidebarAnnotations(TestComponent);

    const annotatorContextProps = {
        getAnnotationsMatchPath: jest.fn(),
        getAnnotationsPath: jest.fn(),
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

    const feedAPI = {
        addAnnotation: jest.fn(),
        feedItems: jest.fn(),
        getCachedItems: jest.fn(),
        deleteAnnotation: jest.fn(),
    };

    const api = {
        getFeedAPI: () => feedAPI,
    };

    const defaultProps = { api, ...annotatorContextProps, file };

    const getWrapper = props => shallow(<WrappedComponent {...defaultProps} {...props} />);

    describe('constructor', () => {
        test('should call redirectDeeplinkedAnnotation', () => {
            getWrapper();

            expect(annotatorContextProps.getAnnotationsMatchPath).toHaveBeenCalledTimes(1);
        });
    });

    describe('componentDidUpdate', () => {
        test.each`
            prevFileVersionId | fileVersionId | expectedCallCount
            ${'122'}          | ${'122'}      | ${0}
            ${'122'}          | ${undefined}  | ${0}
            ${'122'}          | ${'123'}      | ${1}
        `(
            'should call updateActiveVersion if fileVersionId changes',
            ({ prevFileVersionId, fileVersionId, expectedCallCount }) => {
                const match = { params: { fileVersionId } };
                const prevMatch = { params: { fileVersionId: prevFileVersionId } };
                const wrapper = getWrapper({ location: 'foo' });
                const instance = wrapper.instance();

                instance.updateActiveVersion = jest.fn();
                annotatorContextProps.getAnnotationsMatchPath.mockReturnValueOnce(match).mockReturnValueOnce(prevMatch);

                wrapper.setProps({ location: 'bar' });
                expect(instance.updateActiveVersion).toHaveBeenCalledTimes(expectedCallCount);
            },
        );

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
                const instance = wrapper.instance();

                instance.updateActiveAnnotation = jest.fn();
                annotatorContextProps.getAnnotationsMatchPath.mockReturnValue(isAnnotationsPath);

                wrapper.setProps({ annotatorState: { activeAnnotationId } });

                expect(instance.updateActiveAnnotation).toHaveBeenCalledTimes(expectedCount);
            },
        );

        test.each`
            annotation   | expectedCount
            ${{}}        | ${1}
            ${undefined} | ${0}
            ${null}      | ${0}
        `(
            'should call addAnnotation $expectedCount times if annotation changed to $annotation',
            ({ annotation, expectedCount }) => {
                const wrapper = getWrapper();
                wrapper.instance().addAnnotation = jest.fn();
                wrapper.setProps({ annotatorState: { annotation } });

                expect(wrapper.instance().addAnnotation).toHaveBeenCalledTimes(expectedCount);
            },
        );

        test.each`
            fileId   | expectedCount
            ${'123'} | ${0}
            ${'456'} | ${1}
        `('should call onVersionChange appropriately if file id changes to $fileId', ({ fileId, expectedCount }) => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ fileId: '123', onVersionChange });

            wrapper.setProps({ fileId });

            expect(onVersionChange).toHaveBeenCalledTimes(expectedCount);
        });
    });

    describe('redirectDeeplinkedAnnotation()', () => {
        const history = {
            replace: jest.fn(),
        };
        const getAnnotationsMatchPath = jest.fn();
        const getAnnotationsPath = jest.fn();

        beforeEach(() => {
            jest.resetAllMocks();
        });

        test.each`
            fileVersionId | annotationId | expectedCallCount
            ${undefined}  | ${'987'}     | ${0}
            ${'123'}      | ${'987'}     | ${0}
            ${'124'}      | ${'987'}     | ${1}
            ${'124'}      | ${undefined} | ${1}
        `(
            'should call history.replace appropriately if router location annotationId=$annotationId and fileVersionId=$fileVersionId',
            ({ annotationId, fileVersionId, expectedCallCount }) => {
                const wrapper = getWrapper({ file, getAnnotationsMatchPath, getAnnotationsPath, history });
                const instance = wrapper.instance();
                getAnnotationsMatchPath.mockReturnValue({ params: { annotationId, fileVersionId } });

                instance.redirectDeeplinkedAnnotation();

                expect(history.replace).toHaveBeenCalledTimes(expectedCallCount);
            },
        );

        test.each`
            fileVersionId | annotationId | expectedPath
            ${'124'}      | ${'987'}     | ${'/activity/annotations/123/987'}
            ${'124'}      | ${undefined} | ${'/activity/annotations/123'}
        `('should call history.replace with $expectedPath', ({ fileVersionId, annotationId, expectedPath }) => {
            const wrapper = getWrapper({ file, getAnnotationsMatchPath, getAnnotationsPath, history });
            const instance = wrapper.instance();
            getAnnotationsMatchPath.mockReturnValue({ params: { annotationId, fileVersionId } });
            getAnnotationsPath.mockReturnValue(expectedPath);

            instance.redirectDeeplinkedAnnotation();

            expect(history.replace).toHaveBeenCalledWith(expectedPath);
        });
    });

    describe('addAnnotation()', () => {
        const sidebarPanelsRef = { refresh: jest.fn() };

        beforeEach(() => {
            annotatorContextProps.getAnnotationsMatchPath.mockReturnValueOnce({ params: { fileVersionId: '123' } });
        });

        test('should throw if no user', () => {
            const instance = getWrapper({ annotatorState: { meta: { requestId: '123' } } }).instance();

            expect(() => instance.addAnnotation()).toThrow('Bad box user!');
        });

        test('should do nothing if meta or requestId is not present', () => {
            const instance = getWrapper().instance();

            instance.addAnnotation();

            // Only call to getAnnotationsMatchPath comes in the constructor, the one in addAnnotation should not occur
            expect(annotatorContextProps.getAnnotationsMatchPath).toHaveBeenCalledTimes(1);
        });

        test.each`
            hasItems     | expectedAddCount
            ${undefined} | ${0}
            ${[]}        | ${1}
        `(
            'should add the annotation to the feed cache accordingly if the cache items is $hasItems',
            ({ hasItems, expectedAddCount }) => {
                const annotatorStateMock = {
                    meta: {
                        requestId: '123',
                    },
                };

                const wrapper = getWrapper({ annotatorState: annotatorStateMock, currentUser });
                const instance = wrapper.instance();
                feedAPI.getCachedItems.mockReturnValueOnce({ items: hasItems });

                instance.addAnnotation();

                expect(feedAPI.addAnnotation).toHaveBeenCalledTimes(expectedAddCount);
            },
        );

        test.each`
            pathname                            | isOpen   | current             | expectedCount
            ${'/'}                              | ${false} | ${null}             | ${0}
            ${'/details'}                       | ${true}  | ${null}             | ${0}
            ${'/activity'}                      | ${false} | ${null}             | ${0}
            ${'/activity'}                      | ${true}  | ${null}             | ${0}
            ${'/activity'}                      | ${false} | ${sidebarPanelsRef} | ${0}
            ${'/activity'}                      | ${true}  | ${sidebarPanelsRef} | ${1}
            ${'/activity/versions/12345'}       | ${true}  | ${sidebarPanelsRef} | ${1}
            ${'/activity/versions/12345/67890'} | ${true}  | ${sidebarPanelsRef} | ${1}
            ${'/details'}                       | ${true}  | ${sidebarPanelsRef} | ${0}
            ${'/'}                              | ${true}  | ${sidebarPanelsRef} | ${0}
        `(
            'should refresh the sidebarPanels ref accordingly if pathname=$pathname, isOpen=$isOpen, current=$current',
            ({ current, expectedCount, isOpen, pathname }) => {
                const annotatorStateMock = {
                    meta: {
                        requestId: '123',
                    },
                };
                const wrapper = getWrapper({
                    annotatorState: annotatorStateMock,
                    currentUser,
                    isOpen,
                    location: { pathname },
                });
                const instance = wrapper.instance();
                instance.sidebarPanels = {
                    current,
                };

                instance.addAnnotation();

                expect(sidebarPanelsRef.refresh).toHaveBeenCalledTimes(expectedCount);
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
            ${'234'}           | ${'456'}      | ${{ pathname: '/', state: { foo: 'bar' } }} | ${'/activity/annotations/456/234'} | ${{ open: true }}
        `(
            'should set location path based on match param fileVersionId=$fileVersionId and activeAnnotationId=$activeAnnotationId',
            ({ activeAnnotationId, fileVersionId, location, expectedPath, expectedState }) => {
                annotatorContextProps.getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId } });
                annotatorContextProps.getAnnotationsPath.mockReturnValue(expectedPath);

                const annotatorState = {
                    activeAnnotationId,
                };
                const history = { push: jest.fn(), replace: jest.fn() };
                const wrapper = getWrapper({ annotatorState, history, location });
                const instance = wrapper.instance();

                instance.updateActiveAnnotation();

                expect(history.push).toHaveBeenCalledWith({ pathname: expectedPath, state: expectedState });
            },
        );

        test('should use the provided fileVersionId in the annotatorState if provided', () => {
            const annotatorState = {
                activeAnnotationFileVersionId: '456',
                activeAnnotationId: '123',
            };
            const history = { push: jest.fn(), replace: jest.fn() };
            const wrapper = getWrapper({ annotatorState, history, location: { pathname: '/' } });
            const instance = wrapper.instance();

            instance.updateActiveAnnotation();

            expect(annotatorContextProps.getAnnotationsPath).toHaveBeenCalledWith('456', '123');
        });

        test('should fall back to the fileVersionId in the file if none other is provided', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const wrapper = getWrapper({ history, location: { pathname: '/' } });
            const instance = wrapper.instance();

            instance.updateActiveAnnotation();

            expect(annotatorContextProps.getAnnotationsPath).toHaveBeenCalledWith('123', undefined);
        });
    });

    describe('updateActiveVersion()', () => {
        const onVersionChange = jest.fn();
        const version = { type: 'file_version', id: '124' };

        beforeEach(() => {
            annotatorContextProps.getAnnotationsMatchPath.mockReturnValueOnce({ params: { fileVersionId: '123' } });
        });

        test.each`
            fileVersionId | expectedCallCount
            ${'123'}      | ${0}
            ${'124'}      | ${1}
        `(
            'should onVersionChange $expectedCallCount times based on fileVersionId $fileVersionId',
            ({ fileVersionId, expectedCallCount }) => {
                const match = { params: { fileVersionId } };
                const wrapper = getWrapper({ file, onVersionChange });
                const instance = wrapper.instance();
                annotatorContextProps.getAnnotationsMatchPath.mockReturnValueOnce(match);
                feedAPI.getCachedItems.mockReturnValueOnce({ items: [version] });

                instance.updateActiveVersion();

                expect(onVersionChange).toHaveBeenCalledTimes(expectedCallCount);
            },
        );
    });
});
