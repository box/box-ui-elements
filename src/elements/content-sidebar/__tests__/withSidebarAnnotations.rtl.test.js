import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../../test-utils/testing-library';
import withSidebarAnnotations from '../withSidebarAnnotations';
import { Action } from '../../common/annotator-context/types';
import { FEED_ITEM_TYPE_VERSION } from '../../../constants';

describe('elements/content-sidebar/withSidebarAnnotations', () => {
    const TestComponent = React.forwardRef((props, ref) => <div data-testid="test-component" ref={ref} />);
    const WrappedComponent = withSidebarAnnotations(TestComponent);

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

    const getAnnotationsPath = jest.fn();
    const getAnnotationsMatchPath = jest.fn();

    const annotatorContextProps = {
        getAnnotationsMatchPath,
        getAnnotationsPath,
    };

    const history = {
        push: jest.fn(),
        replace: jest.fn(),
    };

    const onVersionChange = jest.fn();

    const defaultProps = {
        api,
        ...annotatorContextProps,
        file,
        history,
        onVersionChange,
        location: { pathname: '/activity' },
    };

    const createComponentElement = (props = {}) => {
        const componentProps = {
            ...defaultProps,
            ...props,
        };

        return (
            <MemoryRouter initialEntries={['/activity']}>
                <WrappedComponent {...componentProps} />
            </MemoryRouter>
        );
    };

    const renderWithSidebarAnnotations = (props = {}) => {
        return render(createComponentElement(props));
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('constructor', () => {
        test('should call redirectDeeplinkedAnnotation', () => {
            renderWithSidebarAnnotations();

            expect(getAnnotationsMatchPath).toHaveBeenCalledTimes(1);
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
                // Setup mocks before rendering (constructor will run during render)
                getAnnotationsMatchPath.mockReturnValue({ params: { annotationId, fileVersionId } });

                renderWithSidebarAnnotations();

                expect(history.replace).toHaveBeenCalledTimes(expectedCallCount);
            },
        );

        test.each`
            fileVersionId | annotationId | expectedPath
            ${'124'}      | ${'987'}     | ${'/activity/annotations/123/987'}
            ${'124'}      | ${undefined} | ${'/activity/annotations/123'}
        `('should call history.replace with $expectedPath', ({ fileVersionId, annotationId, expectedPath }) => {
            // Setup mocks before rendering (constructor will run during render)
            getAnnotationsMatchPath.mockReturnValue({ params: { annotationId, fileVersionId } });
            getAnnotationsPath.mockReturnValue(expectedPath);

            renderWithSidebarAnnotations();

            expect(history.replace).toHaveBeenCalledWith(expectedPath);
        });
    });

    describe('refreshActivitySidebar', () => {
        test.each`
            fileId   | expectedCount
            ${'123'} | ${0}
            ${'456'} | ${1}
        `('should call onVersionChange appropriately if file id changes to $fileId', ({ fileId, expectedCount }) => {
            const { rerender } = renderWithSidebarAnnotations({
                fileId: '123',
            });

            // Clear mocks after initial render to only measure componentDidUpdate effects
            jest.clearAllMocks();

            // Trigger componentDidUpdate by changing the fileId
            rerender(
                createComponentElement({
                    fileId,
                }),
            );

            // Verify the side effect of onVersionChange being called
            expect(onVersionChange).toHaveBeenCalledTimes(expectedCount);

            if (expectedCount > 0) {
                expect(onVersionChange).toHaveBeenCalledWith(null);
            }
        });

        test.each`
            pathname                            | isOpen   | hasRefCurrent | expectedCount
            ${'/'}                              | ${false} | ${false}      | ${0}
            ${'/details'}                       | ${true}  | ${false}      | ${0}
            ${'/activity'}                      | ${false} | ${false}      | ${0}
            ${'/activity'}                      | ${true}  | ${false}      | ${0}
            ${'/activity'}                      | ${false} | ${true}       | ${0}
            ${'/activity'}                      | ${true}  | ${true}       | ${1}
            ${'/activity/versions/12345'}       | ${true}  | ${true}       | ${1}
            ${'/activity/versions/12345/67890'} | ${true}  | ${true}       | ${1}
            ${'/details'}                       | ${true}  | ${true}       | ${0}
            ${'/'}                              | ${true}  | ${true}       | ${0}
        `(
            'should refresh the sidebarPanels ref accordingly if pathname=$pathname, isOpen=$isOpen, hasRefCurrent=$hasRefCurrent',
            ({ pathname, isOpen, hasRefCurrent, expectedCount }) => {
                const mockRefresh = jest.fn();
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

                // Create a custom test component that exposes the ref
                const TestComponentWithRef = React.forwardRef((props, ref) => {
                    React.useImperativeHandle(ref, () => (hasRefCurrent ? { refresh: mockRefresh } : null));
                    return <div data-testid="test-component" />;
                });

                const WrappedComponentWithRef = withSidebarAnnotations(TestComponentWithRef);

                const { rerender } = render(
                    <MemoryRouter initialEntries={[pathname]}>
                        <WrappedComponentWithRef
                            {...defaultProps}
                            annotatorState={{ annotation: {}, action: Action.CREATE_START }}
                            currentUser={currentUser}
                            isOpen={isOpen}
                            location={{ pathname }}
                        />
                    </MemoryRouter>,
                );

                jest.clearAllMocks();

                // Trigger updateAnnotation by changing the annotatorState
                rerender(
                    <MemoryRouter initialEntries={[pathname]}>
                        <WrappedComponentWithRef
                            {...defaultProps}
                            annotatorState={annotatorStateMock}
                            currentUser={currentUser}
                            isOpen={isOpen}
                            location={{ pathname }}
                        />
                    </MemoryRouter>,
                );

                // Verify the side effect of refreshActivitySidebar being called through updateAnnotation
                expect(mockRefresh).toHaveBeenCalledTimes(expectedCount);
                if (expectedCount > 0) {
                    expect(mockRefresh).toHaveBeenCalledWith(false);
                }
            },
        );
    });

    describe('addAnnotation', () => {
        test('should throw if no user', () => {
            const annotatorStateMock = {
                annotation: {},
                action: Action.CREATE_END,
                meta: { requestId: '123' },
            };

            expect(() => {
                const { rerender } = renderWithSidebarAnnotations({
                    annotatorState: { annotation: {}, action: Action.CREATE_START },
                });

                rerender(
                    createComponentElement({
                        annotatorState: annotatorStateMock,
                    }),
                );
            }).toThrow('Bad box user!');
        });

        test('should do nothing if meta or requestId is not present', () => {
            const annotatorStateMock = {
                annotation: {},
                action: Action.CREATE_END,
            };

            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { annotation: {}, action: Action.CREATE_START },
                currentUser,
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: annotatorStateMock,
                    currentUser,
                }),
            );

            expect(feedAPI.addAnnotation).not.toHaveBeenCalled();
        });

        test.each`
            hasItems     | expectedAddCount
            ${undefined} | ${0}
            ${[]}        | ${1}
        `(
            'should add the annotation to the feed cache accordingly if the cache items is $hasItems',
            ({ hasItems, expectedAddCount }) => {
                const annotatorStateMock = {
                    annotation: {},
                    action: Action.CREATE_END,
                    meta: { requestId: '123' },
                };

                feedAPI.getCachedItems.mockReturnValue({ items: hasItems });

                const { rerender } = renderWithSidebarAnnotations({
                    annotatorState: { annotation: {}, action: Action.CREATE_START },
                    currentUser,
                });

                jest.clearAllMocks();
                feedAPI.getCachedItems.mockReturnValue({ items: hasItems });

                rerender(
                    createComponentElement({
                        annotatorState: annotatorStateMock,
                        currentUser,
                    }),
                );

                expect(feedAPI.addAnnotation).toHaveBeenCalledTimes(expectedAddCount);

                if (expectedAddCount > 0) {
                    expect(feedAPI.addAnnotation).toHaveBeenCalledWith(
                        file,
                        currentUser,
                        {},
                        '123',
                        false, // isPending = false for 'create_end' action
                    );
                }
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
                const annotatorStateMock = {
                    annotation,
                    action: Action.CREATE_END,
                    meta: { requestId: '123' },
                };

                feedAPI.getCachedItems.mockReturnValue({ items: [] });

                const { rerender } = renderWithSidebarAnnotations({
                    annotatorState: { annotation: {}, action: Action.CREATE_START },
                    currentUser,
                });

                jest.clearAllMocks();
                feedAPI.getCachedItems.mockReturnValue({ items: [] });

                // Trigger componentDidUpdate by changing the annotatorState
                rerender(
                    createComponentElement({
                        annotatorState: annotatorStateMock,
                        currentUser,
                    }),
                );

                // Verify the side effect of addAnnotation being called
                expect(feedAPI.addAnnotation).toHaveBeenCalledTimes(expectedCount);

                if (expectedCount > 0) {
                    expect(feedAPI.addAnnotation).toHaveBeenCalledWith(
                        file,
                        currentUser,
                        annotation,
                        '123',
                        false, // isPending = false for 'create_end' action
                    );
                }
            },
        );
    });

    describe('addAnnotationReply', () => {
        test.each`
            action
            ${Action.REPLY_CREATE_START}
            ${Action.REPLY_CREATE_END}
        `('should call addAnnotationReply if given action = $action', ({ action }) => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456', tagged_message: 'abc' };
            const requestId = 'comment_456';
            const annotatorStateMock = {
                action,
                annotation,
                annotationReply,
                meta: { requestId },
            };

            feedAPI.getCachedItems.mockReturnValue({
                items: [
                    {
                        id: '123',
                        replies: [annotationReply],
                        total_reply_count: 2,
                    },
                ],
            });

            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { annotation: {}, action: Action.CREATE_START },
                currentUser,
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: annotatorStateMock,
                    currentUser,
                }),
            );

            if (action === Action.REPLY_CREATE_START) {
                expect(feedAPI.addPendingReply).toHaveBeenCalledTimes(1);
                expect(feedAPI.addPendingReply).toHaveBeenCalledWith(annotation.id, currentUser, {
                    ...annotationReply,
                    id: requestId,
                });
                expect(feedAPI.modifyFeedItemRepliesCountBy).not.toHaveBeenCalled();
                expect(feedAPI.updateReplyItem).not.toHaveBeenCalled();
            } else {
                expect(feedAPI.modifyFeedItemRepliesCountBy).toHaveBeenCalledTimes(1);
                expect(feedAPI.modifyFeedItemRepliesCountBy).toHaveBeenCalledWith(annotation.id, 1);
                expect(feedAPI.updateReplyItem).toHaveBeenCalledTimes(1);
                expect(feedAPI.updateReplyItem).toHaveBeenCalledWith(
                    { ...annotationReply, isPending: false },
                    annotation.id,
                    requestId,
                );
                expect(feedAPI.addPendingReply).not.toHaveBeenCalled();
            }
        });
    });

    describe('deleteAnnotation', () => {
        test.each`
            action
            ${Action.DELETE_START}
            ${Action.DELETE_END}
        `('should call deleteAnnotation if given action = $action', ({ action }) => {
            const annotation = { id: '123' };
            const annotatorStateMock = {
                annotation,
                action,
            };

            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { annotation: {}, action: Action.CREATE_START },
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: annotatorStateMock,
                }),
            );

            if (action === Action.DELETE_START) {
                expect(feedAPI.updateFeedItem).toHaveBeenCalledTimes(1);
                expect(feedAPI.updateFeedItem).toHaveBeenCalledWith({ isPending: true }, annotation.id);
                expect(feedAPI.deleteFeedItem).not.toHaveBeenCalled();
            } else {
                expect(feedAPI.deleteFeedItem).toHaveBeenCalledTimes(1);
                expect(feedAPI.deleteFeedItem).toHaveBeenCalledWith(annotation.id);
                expect(feedAPI.updateFeedItem).not.toHaveBeenCalled();
            }
        });
    });

    describe('deleteAnnotationReply', () => {
        test.each`
            action
            ${Action.REPLY_DELETE_START}
            ${Action.REPLY_DELETE_END}
        `('should call deleteAnnotationReply if given action = $action', ({ action }) => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456' };
            const annotatorStateMock = {
                action,
                annotation,
                annotationReply,
            };

            feedAPI.getCachedItems.mockReturnValue({
                items: [
                    {
                        id: '123',
                        replies: [{ id: '456', tagged_message: 'abc' }],
                        total_reply_count: 2,
                    },
                ],
            });

            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { annotation: {}, action: Action.CREATE_START },
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: annotatorStateMock,
                }),
            );

            if (action === Action.REPLY_DELETE_START) {
                expect(feedAPI.updateReplyItem).toHaveBeenCalledTimes(1);
                expect(feedAPI.updateReplyItem).toHaveBeenCalledWith(
                    { isPending: true },
                    annotation.id,
                    annotationReply.id,
                );
                expect(feedAPI.deleteReplyItem).not.toHaveBeenCalled();
                expect(feedAPI.modifyFeedItemRepliesCountBy).not.toHaveBeenCalled();
            } else {
                expect(feedAPI.deleteReplyItem).toHaveBeenCalledTimes(1);
                expect(feedAPI.deleteReplyItem).toHaveBeenCalledWith(annotationReply.id, annotation.id);
                expect(feedAPI.modifyFeedItemRepliesCountBy).toHaveBeenCalledTimes(1);
                expect(feedAPI.modifyFeedItemRepliesCountBy).toHaveBeenCalledWith(annotation.id, -1);
                expect(feedAPI.updateReplyItem).not.toHaveBeenCalled();
            }
        });

        test('should update appropriate annotation if reply is currently not in the feed given action = reply_delete_end', () => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456' };
            const annotatorStateMock = {
                action: Action.REPLY_DELETE_END,
                annotation,
                annotationReply,
            };

            // Mock setup: reply with id '456' is NOT in the cached replies (only '999' is present)
            feedAPI.getCachedItems.mockReturnValue({
                items: [
                    {
                        id: '123',
                        replies: [{ id: '999', tagged_message: 'abc' }],
                        total_reply_count: 2,
                    },
                ],
            });

            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { annotation: {}, action: Action.CREATE_START },
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: annotatorStateMock,
                }),
            );

            // Since reply is not in cached items, only modifyFeedItemRepliesCountBy should be called
            expect(feedAPI.modifyFeedItemRepliesCountBy).toHaveBeenCalledTimes(1);
            expect(feedAPI.modifyFeedItemRepliesCountBy).toHaveBeenCalledWith(annotation.id, -1);
            expect(feedAPI.deleteReplyItem).not.toHaveBeenCalled();
            expect(feedAPI.updateReplyItem).not.toHaveBeenCalled();
        });
    });

    describe('updateAnnotation', () => {
        test.each`
            action                 | expectedIsPending
            ${Action.UPDATE_START} | ${true}
            ${Action.UPDATE_END}   | ${false}
        `('should call updateAnnotation if given action = $action', ({ action, expectedIsPending }) => {
            const annotation = { id: '123', status: 'resolved' };
            const annotatorStateMock = {
                annotation,
                action,
            };

            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { annotation: {}, action: Action.CREATE_START },
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: annotatorStateMock,
                }),
            );

            const expectedAnnotationData = { ...annotation, isPending: expectedIsPending };

            expect(feedAPI.updateFeedItem).toHaveBeenCalledTimes(1);
            expect(feedAPI.updateFeedItem).toHaveBeenCalledWith(expectedAnnotationData, annotation.id);
        });
    });

    describe('updateAnnotationReply', () => {
        test.each`
            action                       | expectedIsPending
            ${Action.REPLY_UPDATE_START} | ${true}
            ${Action.REPLY_UPDATE_END}   | ${false}
        `('should call updateAnnotationReply if given action = $action', ({ action, expectedIsPending }) => {
            const annotation = { id: '123' };
            const annotationReply = { id: '456', tagged_message: 'abc' };
            const annotatorStateMock = {
                action,
                annotation,
                annotationReply,
            };

            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { annotation: {}, action: Action.CREATE_START },
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: annotatorStateMock,
                }),
            );

            const expectedReplyData = { ...annotationReply, isPending: expectedIsPending };

            expect(feedAPI.updateReplyItem).toHaveBeenCalledTimes(1);
            expect(feedAPI.updateReplyItem).toHaveBeenCalledWith(expectedReplyData, annotation.id, annotationReply.id);
        });
    });

    describe('updateActiveAnnotation', () => {
        test.each`
            condition                                          | prevActiveAnnotationId | activeAnnotationId | isAnnotationsPath | expectedHistoryPushCalls | expectedState
            ${'annotation ids are the same'}                   | ${'123'}               | ${'123'}           | ${true}           | ${0}                     | ${undefined}
            ${'annotation ids are different'}                  | ${'123'}               | ${'456'}           | ${true}           | ${1}                     | ${{ open: true }}
            ${'annotation deselected on annotations path'}     | ${'123'}               | ${null}            | ${true}           | ${1}                     | ${{ foo: 'bar' }}
            ${'annotation deselected not on annotations path'} | ${'123'}               | ${null}            | ${false}          | ${0}                     | ${undefined}
            ${'annotation selected not on annotations path'}   | ${null}                | ${'123'}           | ${false}          | ${1}                     | ${{ open: true }}
            ${'annotation selected on annotations path'}       | ${null}                | ${'123'}           | ${true}           | ${1}                     | ${{ open: true }}
        `(
            'should call updateActiveAnnotation appropriately if $condition',
            ({
                prevActiveAnnotationId,
                activeAnnotationId,
                isAnnotationsPath,
                expectedHistoryPushCalls,
                expectedState,
            }) => {
                const location = { pathname: '/activity', state: { foo: 'bar' } };

                getAnnotationsPath.mockReturnValue('/activity/annotations/456/123');
                getAnnotationsMatchPath.mockReturnValue(
                    isAnnotationsPath ? { params: { fileVersionId: '456' } } : null,
                );

                const { rerender } = renderWithSidebarAnnotations({
                    annotatorState: { activeAnnotationId: prevActiveAnnotationId },
                    location,
                });

                jest.clearAllMocks();

                rerender(
                    createComponentElement({
                        annotatorState: { activeAnnotationId, action: 'set_active' },
                        location,
                    }),
                );

                expect(history.push).toHaveBeenCalledTimes(expectedHistoryPushCalls);

                if (expectedHistoryPushCalls > 0) {
                    expect(history.push).toHaveBeenCalledWith({
                        pathname: '/activity/annotations/456/123',
                        state: expectedState,
                    });

                    const expectedFileVersionId = isAnnotationsPath ? '456' : '123';
                    expect(getAnnotationsPath).toHaveBeenCalledWith(expectedFileVersionId, activeAnnotationId);
                    expect(getAnnotationsMatchPath).toHaveBeenCalledWith(location);
                }
            },
        );

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
                getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId } });
                getAnnotationsPath.mockReturnValue(expectedPath);

                const { rerender } = renderWithSidebarAnnotations({
                    annotatorState: { activeAnnotationId: 'initial' },
                    location,
                });

                jest.clearAllMocks();

                rerender(
                    createComponentElement({
                        annotatorState: { activeAnnotationId, action: 'set_active' },
                        location,
                    }),
                );

                expect(history.push).toHaveBeenCalledTimes(1);
                expect(history.push).toHaveBeenCalledWith({ pathname: expectedPath, state: expectedState });
            },
        );

        test('should use the provided fileVersionId in the annotatorState if provided', () => {
            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { activeAnnotationId: 'initial' },
                location: { pathname: '/' },
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: {
                        activeAnnotationFileVersionId: '456',
                        activeAnnotationId: '123',
                        action: 'set_active',
                    },
                    location: { pathname: '/' },
                }),
            );

            expect(getAnnotationsPath).toHaveBeenCalledWith('456', '123');
        });

        test('should fall back to the fileVersionId in the file if none other is provided', () => {
            const { rerender } = renderWithSidebarAnnotations({
                annotatorState: { activeAnnotationId: null },
                location: { pathname: '/' },
            });

            jest.clearAllMocks();

            rerender(
                createComponentElement({
                    annotatorState: {
                        // No activeAnnotationFileVersionId provided, so it should fall back to file version
                        activeAnnotationId: 'some-annotation-id',
                        action: 'set_active',
                    },
                    location: { pathname: '/' },
                }),
            );

            expect(getAnnotationsPath).toHaveBeenCalledWith('123', 'some-annotation-id');
        });
    });

    describe('updateActiveVersion', () => {
        test.each`
            prevFileVersionId | fileVersionId | expectedOnVersionChangeCalls
            ${'122'}          | ${'122'}      | ${0}
            ${'122'}          | ${undefined}  | ${0}
            ${'122'}          | ${'123'}      | ${1}
        `(
            'should call updateActiveVersion if fileVersionId changes from $prevFileVersionId to $fileVersionId',
            ({ prevFileVersionId, fileVersionId, expectedOnVersionChangeCalls }) => {
                const version = { type: FEED_ITEM_TYPE_VERSION, id: fileVersionId };

                const versions = [{ type: FEED_ITEM_TYPE_VERSION, id: prevFileVersionId }];
                if (fileVersionId) {
                    versions.push({ type: FEED_ITEM_TYPE_VERSION, id: fileVersionId });
                }
                feedAPI.getCachedItems.mockReturnValue({ items: versions });

                getAnnotationsPath.mockReturnValue('/activity/annotations/123');
                getAnnotationsMatchPath
                    .mockReturnValueOnce({ params: { fileVersionId: prevFileVersionId } }) // constructor call
                    .mockReturnValueOnce({ params: { fileVersionId: prevFileVersionId } }) // first componentDidUpdate call
                    .mockReturnValueOnce({ params: { fileVersionId } }); // second componentDidUpdate call

                const { rerender } = renderWithSidebarAnnotations({
                    location: { pathname: '/foo' },
                });

                // When updateActiveVersion is called, it should get the NEW fileVersionId from the match
                getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId } });

                // Clear mocks after initial render to only measure componentDidUpdate effects
                jest.clearAllMocks();

                // Trigger componentDidUpdate by changing location
                rerender(
                    createComponentElement({
                        location: { pathname: '/bar' },
                    }),
                );

                expect(onVersionChange).toHaveBeenCalledTimes(expectedOnVersionChangeCalls);

                if (expectedOnVersionChangeCalls > 0) {
                    expect(onVersionChange).toHaveBeenCalledWith(
                        version,
                        expect.objectContaining({
                            currentVersionId: '123',
                            updateVersionToCurrent: expect.any(Function),
                        }),
                    );

                    const callback = onVersionChange.mock.calls[0][1].updateVersionToCurrent;
                    callback();
                    expect(getAnnotationsPath).toHaveBeenCalledWith('123');
                    expect(history.push).toHaveBeenCalledWith('/activity/annotations/123');
                }
            },
        );
    });
});
