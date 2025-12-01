import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { render } from '../../../test-utils/testing-library';
import { ActivitySidebarComponent } from '../ActivitySidebar';
import { formattedReplies } from '../fixtures';
import ActivityFeed from '../activity-feed';
import { ViewType, FeedEntryType } from '../../common/types/SidebarNavigation';

// Mock generatePath from react-router-dom
const mockGeneratePath = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    generatePath: mockGeneratePath,
}));

jest.mock('lodash/debounce', () => jest.fn(i => i));
jest.mock('lodash/uniqueId', () => () => 'uniqueId');

jest.mock('../activity-feed', () => {
    return jest.fn(() => <div data-testid="activity-feed-mock">Activity Feed Mock</div>);
});

jest.mock('../SidebarContent', () => {
    return jest.fn(({ children, actions, className, elementId, sidebarView, title }) => (
        <div
            data-testid="sidebar-content-mock"
            className={className}
            data-element-id={elementId}
            data-sidebar-view={sidebarView}
        >
            <div data-testid="sidebar-title">{title}</div>
            <div data-testid="sidebar-actions">{actions}</div>
            <div data-testid="sidebar-children">{children}</div>
        </div>
    ));
});

describe('elements/content-sidebar/ActivitySidebar', () => {
    const feedAPI = {
        createComment: jest.fn(),
        createReply: jest.fn(),
        createTaskNew: jest.fn(),
        createThreadedComment: jest.fn(),
        deleteAnnotation: jest.fn(),
        deleteComment: jest.fn(),
        deleteReply: jest.fn(),
        deleteTaskNew: jest.fn(),
        deleteThreadedComment: jest.fn(),
        feedItems: jest.fn(),
        fetchReplies: jest.fn(),
        fetchThreadedComment: jest.fn(),
        updateAnnotation: jest.fn(),
        updateComment: jest.fn(),
        updateFeedItem: jest.fn(),
        updateReply: jest.fn(),
        updateTaskCollaborator: jest.fn(),
        updateTaskNew: jest.fn(),
        updateThreadedComment: jest.fn(),
    };
    const usersAPI = {
        get: jest.fn(),
        getAvatarUrlWithAccessToken: jest.fn().mockResolvedValue('foo'),
        getUser: jest.fn(),
    };
    const fileCollaboratorsAPI = {
        getCollaboratorsWithQuery: jest.fn(),
    };
    const api = {
        getUsersAPI: () => usersAPI,
        getFeedAPI: () => feedAPI,
        getFileCollaboratorsAPI: () => fileCollaboratorsAPI,
    };
    const file = {
        id: 'I_AM_A_FILE',
        file_version: {
            id: '123',
        },
    };
    const currentUser = {
        id: '123',
        name: 'foo bar',
    };
    const onError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockGeneratePath.mockClear();
    });

    const renderActivitySidebar = (props = {}) => {
        const defaultProps = {
            api,
            currentUser,
            file,
            logger: { onReadyMetric: jest.fn(), onDataReadyMetric: jest.fn() },
            onError,
            ...props,
        };

        return render(
            <MemoryRouter initialEntries={['/activity']}>
                <ActivitySidebarComponent {...defaultProps} />
            </MemoryRouter>,
        );
    };

    describe('handleAnnotationSelect()', () => {
        let emitActiveAnnotationChangeEvent;
        let getAnnotationsMatchPath;
        let getAnnotationsPath;
        let history;
        let onAnnotationSelect;
        let annotation;

        beforeEach(() => {
            emitActiveAnnotationChangeEvent = jest.fn();
            getAnnotationsMatchPath = jest.fn().mockReturnValue({ params: { fileVersionId: '456' } });
            getAnnotationsPath = jest.fn().mockReturnValue('/activity/annotations/235/124');
            history = { push: jest.fn(), replace: jest.fn() };
            onAnnotationSelect = jest.fn();
            annotation = { file_version: { id: '235' }, id: '124' };

            feedAPI.feedItems = jest
                .fn()
                .mockImplementationOnce((_, __, callback) => callback([]))
                .mockImplementation(() => {});
        });

        test('should call emitActiveAnnotationChangeEvent and onAnnotationSelect appropriately', () => {
            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).toHaveBeenCalledWith('/activity/annotations/235/124');
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, false);
        });

        test('should not call history.push if file versions are the same', () => {
            getAnnotationsPath.mockReturnValue('/activity/annotations/456/124');
            annotation = { file_version: { id: '456' }, id: '124' };

            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).not.toHaveBeenCalled();
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });

        test('should use current file version if match params returns null', () => {
            getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: undefined } });

            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).toHaveBeenCalledWith('/activity/annotations/235/124');
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, false);
        });

        test('should not call history.push if no file version id on the annotation', () => {
            getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: undefined } });
            getAnnotationsPath.mockReturnValue('/activity/annotations/null/124');
            annotation = { file_version: null, id: '124' };

            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).not.toHaveBeenCalled();
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });

        test('should call onAnnotationSelect with isVideoAnnotation true if video annotation', () => {
            getAnnotationsPath.mockReturnValue('/activity/annotations/235/124');
            annotation = { file_version: { id: '235' }, id: '124' };
            document.querySelector = jest.fn().mockReturnValue({ className: 'bp-media-container' });
            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(history.push).toHaveBeenCalledWith('/activity/annotations/235/124');
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, true);
        });
    });

    describe('handleAnnotationSelect() - Router Disabled', () => {
        let emitActiveAnnotationChangeEvent;
        let getAnnotationsMatchPath;
        let getAnnotationsPath;
        let internalSidebarNavigationHandler;
        let onAnnotationSelect;
        let annotation;

        beforeEach(() => {
            emitActiveAnnotationChangeEvent = jest.fn();
            getAnnotationsMatchPath = jest.fn().mockReturnValue({ params: { fileVersionId: '456' } });
            getAnnotationsPath = jest.fn().mockReturnValue('/activity/annotations/235/124');
            internalSidebarNavigationHandler = jest.fn();
            onAnnotationSelect = jest.fn();
            annotation = { file_version: { id: '235' }, id: '124' };

            feedAPI.feedItems = jest
                .fn()
                .mockImplementationOnce((_, __, callback) => callback([]))
                .mockImplementation(() => {});
        });

        test('should call emitActiveAnnotationChangeEvent and onAnnotationSelect appropriately', () => {
            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                routerDisabled: true,
                internalSidebarNavigationHandler,
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(internalSidebarNavigationHandler).toHaveBeenCalledWith({
                sidebar: ViewType.ACTIVITY,
                activeFeedEntryType: FeedEntryType.ANNOTATIONS,
                activeFeedEntryId: '124',
                fileVersionId: '235',
            });
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, false);
        });

        test('should not call internalSidebarNavigationHandler if file versions are the same', () => {
            getAnnotationsPath.mockReturnValue('/activity/annotations/456/124');
            annotation = { file_version: { id: '456' }, id: '124' };

            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                routerDisabled: true,
                internalSidebarNavigationHandler,
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(internalSidebarNavigationHandler).not.toHaveBeenCalled();
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });

        test('should use current file version if match params returns null', () => {
            getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: undefined } });

            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                routerDisabled: true,
                internalSidebarNavigationHandler,
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(internalSidebarNavigationHandler).toHaveBeenCalledWith({
                sidebar: ViewType.ACTIVITY,
                activeFeedEntryType: FeedEntryType.ANNOTATIONS,
                activeFeedEntryId: '124',
                fileVersionId: '235',
            });
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, false);
        });

        test('should not call internalSidebarNavigationHandler if no file version id on the annotation', () => {
            getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: undefined } });
            getAnnotationsPath.mockReturnValue('/activity/annotations/null/124');
            annotation = { file_version: null, id: '124' };

            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                routerDisabled: true,
                internalSidebarNavigationHandler,
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(internalSidebarNavigationHandler).not.toHaveBeenCalled();
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation);
        });

        test('should call onAnnotationSelect with isVideoAnnotation true if video annotation and is not current file version', () => {
            getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: '456' } });
            getAnnotationsPath.mockReturnValue('/activity/annotations/456/124');
            annotation = { file_version: { id: '457' }, id: '124' };

            ActivityFeed.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });
            document.querySelector = jest.fn().mockReturnValue({ className: 'bp-media-container' });

            // m
            renderActivitySidebar({
                routerDisabled: true,
                internalSidebarNavigationHandler,
                emitActiveAnnotationChangeEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                onAnnotationSelect,
            });

            expect(emitActiveAnnotationChangeEvent).toHaveBeenCalledWith('124');
            expect(internalSidebarNavigationHandler).toHaveBeenCalledWith({
                sidebar: ViewType.ACTIVITY,
                activeFeedEntryType: FeedEntryType.ANNOTATIONS,
                activeFeedEntryId: '124',
                fileVersionId: '457',
            });
            expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, true);
        });
    });

    describe('updateReplies()', () => {
        test('should call updateFeedItem API', () => {
            const id = '123';
            const replies = cloneDeep(formattedReplies);

            ActivityFeed.mockImplementation(({ onHideReplies }) => {
                if (onHideReplies) {
                    onHideReplies(id, replies);
                }

                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            feedAPI.feedItems = jest
                .fn()
                .mockImplementationOnce((_, __, callback) => callback(['test']))
                .mockImplementation(() => {});

            renderActivitySidebar();

            expect(feedAPI.updateFeedItem).toHaveBeenCalledWith({ replies }, id);
            expect(feedAPI.feedItems).toHaveBeenCalled();
        });

        test('should disable active item if replies are being hidden and activeFeedEntryId belongs to a reply that is in currently being updated parent', () => {
            const historyReplace = jest.fn();
            const activeReplyId = '123';
            const itemId = '999';
            const lastReplyId = '456';
            const replies = [{ id: lastReplyId }];

            mockGeneratePath.mockReturnValue('/activity');

            feedAPI.feedItems = jest
                .fn()
                .mockImplementationOnce((_, __, callback) =>
                    callback([{ id: itemId, replies: [{ id: activeReplyId }, { id: lastReplyId }], type: 'comment' }]),
                )
                .mockImplementation(() => {});

            ActivityFeed.mockImplementation(({ onHideReplies }) => {
                if (onHideReplies) {
                    onHideReplies(itemId, replies);
                }

                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                activeFeedEntryId: activeReplyId,
                history: { replace: historyReplace },
            });

            expect(historyReplace).toHaveBeenCalledWith('/activity');
            expect(feedAPI.updateFeedItem).toHaveBeenCalledWith({ replies }, itemId);
        });

        test('should call generatePath when getActiveCommentPath is called with commentId', () => {
            const historyReplace = jest.fn();
            const activeReplyId = '123';
            const itemId = '999';
            const lastReplyId = '456';
            const replies = [{ id: lastReplyId }];

            mockGeneratePath.mockReturnValue('/activity/comments/123');

            feedAPI.feedItems = jest
                .fn()
                .mockImplementationOnce((_, __, callback) =>
                    callback([
                        { id: activeReplyId, type: 'comment' },
                        { id: itemId, replies: [{ id: lastReplyId }], type: 'comment' },
                    ]),
                )
                .mockImplementation(() => {});

            ActivityFeed.mockImplementation(({ onHideReplies }) => {
                if (onHideReplies) {
                    onHideReplies(itemId, replies);
                }

                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                activeFeedEntryId: activeReplyId,
                history: { replace: historyReplace },
            });

            expect(historyReplace).not.toHaveBeenCalled();
            expect(mockGeneratePath).not.toHaveBeenCalled();
        });
    });

    describe('updateReplies() - Router Disabled', () => {
        test('should disable active item if replies are being hidden and activeFeedEntryId belongs to a reply that is in currently being updated parent', () => {
            const internalSidebarNavigationHandler = jest.fn();
            const activeReplyId = '123';
            const itemId = '999';
            const lastReplyId = '456';
            const replies = [{ id: lastReplyId }];

            feedAPI.feedItems = jest
                .fn()
                .mockImplementationOnce((_, __, callback) =>
                    callback([{ id: itemId, replies: [{ id: activeReplyId }, { id: lastReplyId }], type: 'comment' }]),
                )
                .mockImplementation(() => {});

            ActivityFeed.mockImplementation(({ onHideReplies }) => {
                if (onHideReplies) {
                    onHideReplies(itemId, replies);
                }

                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                routerDisabled: true,
                internalSidebarNavigationHandler,
                activeFeedEntryId: activeReplyId,
            });

            expect(internalSidebarNavigationHandler).toHaveBeenCalledWith(
                {
                    sidebar: ViewType.ACTIVITY,
                },
                true,
            );
            expect(feedAPI.updateFeedItem).toHaveBeenCalledWith({ replies }, itemId);
        });

        test('should not call internalSidebarNavigationHandler when activeReplyId is not being removed', () => {
            const internalSidebarNavigationHandler = jest.fn();
            const activeReplyId = '123';
            const itemId = '999';
            const lastReplyId = '456';
            const replies = [{ id: lastReplyId }];

            feedAPI.feedItems = jest
                .fn()
                .mockImplementationOnce((_, __, callback) =>
                    callback([
                        { id: activeReplyId, type: 'comment' },
                        { id: itemId, replies: [{ id: lastReplyId }], type: 'comment' },
                    ]),
                )
                .mockImplementation(() => {});

            ActivityFeed.mockImplementation(({ onHideReplies }) => {
                if (onHideReplies) {
                    onHideReplies(itemId, replies);
                }

                return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
            });

            renderActivitySidebar({
                routerDisabled: true,
                internalSidebarNavigationHandler,
                activeFeedEntryId: activeReplyId,
            });

            expect(internalSidebarNavigationHandler).not.toHaveBeenCalled();
            expect(feedAPI.updateFeedItem).toHaveBeenCalledWith({ replies }, itemId);
        });
    });
});
