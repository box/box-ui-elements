import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '../../../test-utils/testing-library';
import { ActivitySidebarComponent } from '../ActivitySidebar';
import ActivityFeedV2 from '../activity-feed-v2';
import { ViewType, FeedEntryType } from '../../common/types/SidebarNavigation';

// Mock generatePath from react-router-dom
const mockGeneratePath = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    generatePath: mockGeneratePath,
}));

jest.mock('lodash/debounce', () => jest.fn(i => i));
jest.mock('lodash/uniqueId', () => () => 'uniqueId');

jest.mock('../activity-feed-v2', () => {
    return jest.fn(() => <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>);
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
        ActivityFeedV2.mockImplementation(() => <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>);
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
            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

        test.each([
            { locationType: 'frame', isVideoAnnotation: true },
            { locationType: 'page', isVideoAnnotation: false },
        ])(
            'should call onAnnotationSelect with isVideoAnnotation $isVideoAnnotation if location type is $locationType',
            ({ locationType, isVideoAnnotation }) => {
                getAnnotationsPath.mockReturnValue('/activity/annotations/235/124');
                annotation = { file_version: { id: '235' }, id: '124', target: { location: { type: locationType } } };
                ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                    if (onAnnotationSelectProp) {
                        onAnnotationSelectProp(annotation);
                    }
                    return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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
                expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, isVideoAnnotation);
            },
        );
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
            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

            ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                if (onAnnotationSelectProp) {
                    onAnnotationSelectProp(annotation);
                }
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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

        test.each([
            { locationType: 'frame', isVideoAnnotation: true },
            { locationType: 'page', isVideoAnnotation: false },
        ])(
            'should call onAnnotationSelect with isVideoAnnotation $isVideoAnnotation if location type is $locationType',
            ({ locationType, isVideoAnnotation }) => {
                getAnnotationsMatchPath.mockReturnValue({ params: { fileVersionId: '456' } });
                getAnnotationsPath.mockReturnValue('/activity/annotations/456/124');
                annotation = { file_version: { id: '457' }, id: '124', target: { location: { type: locationType } } };

                ActivityFeedV2.mockImplementation(({ onAnnotationSelect: onAnnotationSelectProp }) => {
                    if (onAnnotationSelectProp) {
                        onAnnotationSelectProp(annotation);
                    }
                    return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
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
                    fileVersionId: '457',
                });
                expect(onAnnotationSelect).toHaveBeenCalledWith(annotation, isVideoAnnotation);
            },
        );
    });

    describe('render() - always renders ActivityFeedV2', () => {
        test('should always render ActivityFeedV2', () => {
            renderActivitySidebar();
            expect(screen.getByTestId('activity-feed-adapter-v2')).toBeInTheDocument();
        });

        test('should pass isAudioPlayerV2Enabled to ActivityFeedV2 when audioPlayerV2 is enabled', () => {
            renderActivitySidebar({
                features: {
                    audioPlayerV2: { enabled: true },
                },
            });
            expect(ActivityFeedV2).toHaveBeenCalledWith(
                expect.objectContaining({ isAudioPlayerV2Enabled: true }),
                expect.anything(),
            );
        });

        test('should pass isAudioPlayerV2Enabled false to ActivityFeedV2 when audioPlayerV2 is not set', () => {
            renderActivitySidebar();
            expect(ActivityFeedV2).toHaveBeenCalledWith(
                expect.objectContaining({ isAudioPlayerV2Enabled: false }),
                expect.anything(),
            );
        });
    });

    describe('handleCommentVersionSelect()', () => {
        const params = { commentId: 'c-1', fileVersionId: '235', startMs: 5000 };

        const selectFromFeed = () =>
            ActivityFeedV2.mockImplementation(({ onCommentVersionSelect }) => {
                onCommentVersionSelect?.(params);
                return <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>;
            });

        afterEach(() => {
            ActivityFeedV2.mockImplementation(() => <div data-testid="activity-feed-adapter-v2">Activity Feed V2</div>);
        });

        test('should route to the comment version and pass the timestamp up', () => {
            const getAnnotationsPath = jest.fn().mockReturnValue('/activity/annotations/235/c-1');
            const history = { push: jest.fn(), replace: jest.fn() };
            const onCommentVersionSelect = jest.fn();
            selectFromFeed();

            renderActivitySidebar({ getAnnotationsPath, history, onCommentVersionSelect });

            expect(getAnnotationsPath).toHaveBeenCalledWith('235', 'c-1');
            expect(history.push).toHaveBeenCalledWith('/activity/annotations/235/c-1');
            expect(onCommentVersionSelect).toHaveBeenCalledWith({ fileVersionId: '235', startMs: 5000 });
        });

        test('should use internal navigation when the router is disabled', () => {
            const internalSidebarNavigationHandler = jest.fn();
            const onCommentVersionSelect = jest.fn();
            selectFromFeed();

            renderActivitySidebar({
                internalSidebarNavigationHandler,
                onCommentVersionSelect,
                routerDisabled: true,
            });

            expect(internalSidebarNavigationHandler).toHaveBeenCalledWith({
                sidebar: ViewType.ACTIVITY,
                activeFeedEntryId: 'c-1',
                activeFeedEntryType: FeedEntryType.ANNOTATIONS,
                fileVersionId: '235',
            });
            expect(onCommentVersionSelect).toHaveBeenCalledWith({ fileVersionId: '235', startMs: 5000 });
        });
    });

    describe('render() - richText feature gate', () => {
        test('should pass isRichTextEnabled=true to ActivityFeedV2 when richText is enabled', () => {
            renderActivitySidebar({
                features: {
                    activityFeed: { richText: { enabled: true } },
                },
            });

            expect(ActivityFeedV2).toHaveBeenCalledWith(
                expect.objectContaining({ isRichTextEnabled: true }),
                expect.anything(),
            );
        });

        test('should pass isRichTextEnabled=false to ActivityFeedV2 when richText is not enabled', () => {
            renderActivitySidebar();

            expect(ActivityFeedV2).toHaveBeenCalledWith(
                expect.objectContaining({ isRichTextEnabled: false }),
                expect.anything(),
            );
        });
    });
});
