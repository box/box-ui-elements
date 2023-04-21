import * as React from 'react';
import { shallow } from 'enzyme';
import withSidebarAnnotations from '../withSidebarAnnotations';
import { Action } from '../../common/annotator-context/types';
import { FEED_ITEM_TYPE_VERSION } from '../../../constants';

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
        addPendingReply: jest.fn(),
        feedItems: jest.fn(),
        getCachedItems: jest.fn(),
        deleteAnnotation: jest.fn(),
        deleteFeedItem: jest.fn(),
        deleteReplyItem: jest.fn(),
        modifyFeedItemRepliesCountBy: jest.fn(),
        updateFeedItem: jest.fn(),
        updateReplyItem: jest.fn(),
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

                wrapper.setProps({ annotatorState: { activeAnnotationId, action: Action.SET_ACTIVE } });

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
                wrapper.setProps({ annotatorState: { annotation, action: Action.CREATE_END } });

                expect(wrapper.instance().addAnnotation).toHaveBeenCalledTimes(expectedCount);
            },
        );

        test.each`
            action
            ${Action.UPDATE_START}
            ${Action.UPDATE_END}
        `('should call updateAnnotation if given action = $action', ({ action }) => {
            const annotation = { id: '123', status: 'resolved' };

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.updateAnnotation = jest.fn();
            wrapper.setProps({ annotatorState: { annotation, action } });
            expect(instance.updateAnnotation).toBeCalled();
        });

        test.each`
            action
            ${Action.DELETE_START}
            ${Action.DELETE_END}
        `('should call deleteAnnotation if given action = $action', ({ action }) => {
            const annotation = { id: '123' };

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.deleteAnnotation = jest.fn();
            wrapper.setProps({ annotatorState: { annotation, action } });
            expect(instance.deleteAnnotation).toBeCalled();
        });

        test.each`
            action
            ${Action.REPLY_CREATE_START}
            ${Action.REPLY_CREATE_END}
        `('should call addAnnotationReply if given action = $action', ({ action }) => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456', tagged_message: 'abc' };

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.addAnnotationReply = jest.fn();
            wrapper.setProps({ annotatorState: { action, annotation, annotationReply } });
            expect(instance.addAnnotationReply).toBeCalled();
        });

        test.each`
            action
            ${Action.REPLY_DELETE_START}
            ${Action.REPLY_DELETE_END}
        `('should call deleteAnnotationReply if given action = $action', ({ action }) => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456' };

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.deleteAnnotationReply = jest.fn();
            wrapper.setProps({ annotatorState: { action, annotation, annotationReply } });
            expect(instance.deleteAnnotationReply).toBeCalled();
        });

        test.each`
            action
            ${Action.REPLY_UPDATE_START}
            ${Action.REPLY_UPDATE_END}
        `('should call updateAnnotationReply if given action = $action', ({ action }) => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456', tagged_message: 'abc' };

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.updateAnnotationReply = jest.fn();
            wrapper.setProps({ annotatorState: { action, annotation, annotationReply } });
            expect(instance.updateAnnotationReply).toBeCalled();
        });

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
    });

    describe('addAnnotationReply()', () => {
        test('should add appropriate reply into the feed given action = reply_create_start', () => {
            const annotation = { id: '123' };
            const annotationReply = { tagged_message: 'abc' };
            const requestId = 'comment_456';
            const annotatorStateMock = {
                action: Action.REPLY_CREATE_START,
                annotation,
                annotationReply,
                meta: { requestId },
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock, currentUser });
            const instance = wrapper.instance();

            instance.addAnnotationReply();

            const expectedReplyData = { ...annotationReply, id: requestId };
            expect(feedAPI.addPendingReply).toBeCalledWith(annotation.id, currentUser, expectedReplyData);
        });

        test('should update appropriate annotation and its reply in the feed given action = reply_create_end', () => {
            feedAPI.getCachedItems.mockReturnValueOnce({
                items: [
                    {
                        id: '123',
                        replies: [{ id: 'comment_456', tagged_message: 'abc' }],
                        total_reply_count: 2,
                    },
                ],
            });
            const annotation = { id: '123' };
            const annotationReply = { id: '456', tagged_message: 'abc' };
            const requestId = 'comment_456';
            const annotatorStateMock = {
                action: Action.REPLY_CREATE_END,
                annotation,
                annotationReply,
                meta: { requestId },
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock, currentUser });
            const instance = wrapper.instance();

            instance.addAnnotationReply();

            const expectedReplyData = { ...annotationReply, isPending: false };
            expect(feedAPI.modifyFeedItemRepliesCountBy).toBeCalledWith(annotation.id, 1);
            expect(feedAPI.updateReplyItem).toBeCalledWith(expectedReplyData, annotation.id, requestId);
        });
    });

    describe('deleteAnnotation()', () => {
        test('should change appropriate annotation to pending when action = delete_start', () => {
            const annotation = { id: '123' };
            const annotatorStateMock = {
                annotation,
                action: Action.DELETE_START,
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock });
            const instance = wrapper.instance();

            instance.deleteAnnotation();

            expect(feedAPI.updateFeedItem).toBeCalledWith({ isPending: true }, annotation.id);
        });

        test('should remove appropriate annotation from feed when action = delete_end', () => {
            const annotation = { id: '123' };
            const annotatorStateMock = {
                annotation,
                action: Action.DELETE_END,
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock });
            const instance = wrapper.instance();

            instance.deleteAnnotation();

            expect(feedAPI.deleteFeedItem).toBeCalledWith(annotation.id);
        });
    });

    describe('deleteAnnotationReply()', () => {
        test('should update appropriate reply in the feed given action = reply_delete_start', () => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456' };
            const annotatorStateMock = {
                action: Action.REPLY_DELETE_START,
                annotation,
                annotationReply,
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock });
            const instance = wrapper.instance();

            instance.deleteAnnotationReply();

            expect(feedAPI.updateReplyItem).toBeCalledWith({ isPending: true }, annotation.id, annotationReply.id);
        });

        test('should update appropriate annotation if reply is currently not in the feed given action = reply_delete_end', () => {
            feedAPI.getCachedItems.mockReturnValueOnce({
                items: [
                    {
                        id: '123',
                        replies: [{ id: '999', tagged_message: 'abc' }],
                        total_reply_count: 2,
                    },
                ],
            });
            const annotation = { id: '123' };
            const annotationReply = { id: '456', tagged_message: 'abc' };
            const annotatorStateMock = {
                action: Action.REPLY_DELETE_END,
                annotation,
                annotationReply,
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock });
            const instance = wrapper.instance();

            instance.deleteAnnotationReply();

            expect(feedAPI.modifyFeedItemRepliesCountBy).toBeCalledWith(annotation.id, -1);
        });

        test('should delete appropriate reply from the feed if it is currently in the feed given action = reply_delete_end', () => {
            feedAPI.getCachedItems.mockReturnValueOnce({
                items: [
                    {
                        id: '123',
                        replies: [{ id: '456', tagged_message: 'abc' }],
                        total_reply_count: 2,
                    },
                ],
            });
            const annotation = { id: '123' };
            const annotationReply = { id: '456', tagged_message: 'abc' };
            const annotatorStateMock = {
                action: Action.REPLY_DELETE_END,
                annotation,
                annotationReply,
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock });
            const instance = wrapper.instance();

            instance.deleteAnnotationReply();

            expect(feedAPI.deleteReplyItem).toBeCalledWith(annotationReply.id, annotation.id);
            expect(feedAPI.modifyFeedItemRepliesCountBy).toBeCalledWith(annotation.id, -1);
        });
    });

    describe('updateAnnotation()', () => {
        test.each`
            action                 | expectedIsPending
            ${Action.UPDATE_START} | ${true}
            ${Action.UPDATE_END}   | ${false}
        `(
            'should update appropriate annotation in the feed given action = $action',
            ({ action, expectedIsPending }) => {
                const annotation = { id: '123', status: 'resolved' };
                const annotatorStateMock = {
                    annotation,
                    action,
                };

                const wrapper = getWrapper({ annotatorState: annotatorStateMock });
                const instance = wrapper.instance();

                instance.updateAnnotation();

                const expectedAnnotationData = { ...annotation, isPending: expectedIsPending };
                expect(feedAPI.updateFeedItem).toBeCalledWith(expectedAnnotationData, annotation.id);
            },
        );
    });

    describe('updateAnnotationReply()', () => {
        test.each`
            action                       | expectedIsPending
            ${Action.REPLY_UPDATE_START} | ${true}
            ${Action.REPLY_UPDATE_END}   | ${false}
        `('should update appropriate reply in the feed given action = $action', ({ action, expectedIsPending }) => {
            const annotation = { id: '123', status: 'resolved' };
            const annotationReply = { id: '456', tagged_message: 'abc' };
            const annotatorStateMock = {
                annotation,
                annotationReply,
                action,
            };

            const wrapper = getWrapper({ annotatorState: annotatorStateMock });
            const instance = wrapper.instance();

            instance.updateAnnotationReply();

            const expectedReplyData = { ...annotationReply, isPending: expectedIsPending };
            expect(feedAPI.updateReplyItem).toBeCalledWith(expectedReplyData, annotation.id, annotationReply.id);
        });
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
        const version = { type: FEED_ITEM_TYPE_VERSION, id: '124' };

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

    describe('refreshActivitySidebar()', () => {
        const history = { replace: jest.fn() };
        const sidebarPanelsRef = { refresh: jest.fn() };

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
                const annotationUpdate = {
                    id: '123',
                    description: {
                        message: 'text',
                    },
                };
                const annotatorStateMock = {
                    action: Action.UPDATE_END,
                    annotation: annotationUpdate,
                };
                const wrapper = getWrapper({
                    annotatorState: annotatorStateMock,
                    currentUser,
                    history,
                    isOpen,
                    location: { pathname },
                });
                const instance = wrapper.instance();
                instance.sidebarPanels = {
                    current,
                };

                instance.updateAnnotation();

                expect(sidebarPanelsRef.refresh).toBeCalledTimes(expectedCount);
            },
        );
    });
});
