import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import FeedItemRow from '../FeedItemRow';
import type { TaskNew } from '../../../../common/types/tasks';

import type {
    TransformedCommentItem,
    TransformedAnnotationItem,
    TransformedFeedItem,
    UserSelectorProps,
} from '../types';

// Capture props passed to mocked components for callback testing
let lastThreadedAnnotationProps: Record<string, unknown> = {};
let lastTaskProps: Record<string, unknown> = {};
let lastVersionProps: Record<string, unknown> = {};

jest.mock('@box/activity-feed', () => {
    const ActivityFeedList = ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>;
    ActivityFeedList.AppActivity = (props: Record<string, unknown>) => (
        <article aria-label="app activity">{String(props.id)}</article>
    );
    ActivityFeedList.Task = (props: Record<string, unknown>) => {
        lastTaskProps = props;
        return <article aria-label="task">{String(props.id)}</article>;
    };
    ActivityFeedList.ThreadedAnnotation = (props: Record<string, unknown>) => {
        lastThreadedAnnotationProps = props;
        return <article aria-label="threaded annotation">{String(props.isResolved)}</article>;
    };
    ActivityFeedList.Version = (props: Record<string, unknown>) => {
        lastVersionProps = props;
        return <article aria-label="version">{String(props.id)}</article>;
    };
    return { ActivityFeed: { List: ActivityFeedList } };
});

jest.mock('@box/threaded-annotations', () => ({
    AnnotationBadgeType: {
        Drawing: 'drawing',
        Frame: 'frame',
        Highlight: 'highlight',
        Point: 'point',
        Region: 'region',
    },
    serializeMentionMarkup: () => ({ hasMention: false, text: 'serialized-text' }),
}));

const userSelectorProps: UserSelectorProps = {
    ariaRoleDescription: 'user selector',
    fetchAvatarUrls: () => Promise.resolve({}),
    fetchUsers: () => Promise.resolve([]),
    loadingAriaLabel: 'Loading...',
};

const commentPermissions = { can_delete: true, can_edit: true, can_reply: true, can_resolve: true };

const mockComment: TransformedCommentItem = {
    id: 'comment-1',
    isResolved: false,
    messages: [
        {
            id: 'comment-1',
            message: { type: 'doc', content: [] },
            createdAt: 0,
            author: { name: 'User', id: 1, email: 'u@b.com' },
            permissions: { canDelete: true, canEdit: true, canReply: true, canResolve: true },
        },
    ],
    originalText: 'Hello world',
    permissions: commentPermissions,
    type: 'comment',
};

const annotationPermissions = { can_delete: true, can_edit: true, can_reply: true, can_resolve: true };

const mockAnnotation: TransformedAnnotationItem = {
    annotation: {
        created_at: '2024-01-01T00:00:00Z',
        created_by: { id: '1', name: 'User', type: 'user' },
        description: { message: 'text' },
        file_version: { id: 'fv1', type: 'version', version_number: '1' },
        id: 'annotation-1',
        modified_at: '2024-01-01T00:00:00Z',
        modified_by: { id: '1', name: 'User', type: 'user' },
        permissions: annotationPermissions,
        target: { location: { type: 'page', value: 3 }, type: 'point', x: 0, y: 0 },
        type: 'annotation',
    } as TransformedAnnotationItem['annotation'],
    id: 'annotation-1',
    isResolved: false,
    messages: [
        {
            id: 'annotation-1',
            message: { type: 'doc', content: [] },
            createdAt: 0,
            author: { name: 'User', id: 1, email: 'u@b.com' },
            permissions: { canDelete: true, canEdit: true, canReply: true, canResolve: true },
        },
    ],
    permissions: annotationPermissions,
    type: 'annotation',
};

const mockOriginalTask = {
    assigned_to: { entries: [], limit: 20, next_marker: null },
    completion_rule: 'ALL_ASSIGNEES',
    created_at: '2024-01-01T00:00:00Z',
    created_by: {
        id: 'tc',
        role: 'CREATOR',
        status: 'NOT_STARTED',
        target: { id: 'user-1', name: 'Creator' },
        type: 'task_collaborator',
    },
    description: 'Review',
    id: 'task-1',
    permissions: {
        can_create_task_collaborator: false,
        can_create_task_link: false,
        can_delete: true,
        can_update: true,
    },
    status: 'NOT_STARTED',
    task_links: { entries: [], limit: 20, next_marker: null },
    task_type: 'GENERAL',
    type: 'task',
} as unknown as TaskNew;

const mockTask: TransformedFeedItem = {
    id: 'task-1',
    originalTask: mockOriginalTask,
    props: {
        assignees: [],
        author: { id: 'user-1', name: 'Creator' },
        completionRule: 'ALL_ASSIGNEES' as unknown as never,
        createdAt: 0,
        description: 'Review',
        id: 'task-1',
        permissions: { canCreateTaskCollaborator: false, canCreateTaskLink: false, canDelete: true, canUpdate: true },
        status: 'NOT_STARTED' as unknown as never,
        taskType: 'GENERAL' as unknown as never,
    },
    type: 'task',
};

const mockVersion: TransformedFeedItem = {
    id: 'version-1',
    props: { actionType: 'upload' as const, id: 'version-1', versionNumber: 5 },
    type: 'version',
};

const mockAppActivity: TransformedFeedItem = {
    id: 'app-1',
    props: { appIconUrl: 'icon.png', appName: 'Slack', createdAt: 0, id: 'app-1', renderedText: 'Shared' },
    type: 'app_activity',
};

const defaultProps = {
    isDisabled: false,
    userSelectorProps,
};

describe('elements/content-sidebar/activity-feed-v2/FeedItemRow', () => {
    beforeEach(() => {
        lastThreadedAnnotationProps = {};
        lastTaskProps = {};
        lastVersionProps = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('comment rendering', () => {
        test('should render a comment as ThreadedAnnotation with correct props', () => {
            render(<FeedItemRow {...defaultProps} item={mockComment} />);
            expect(screen.getByRole('article', { name: 'threaded annotation' })).toBeVisible();
            expect(lastThreadedAnnotationProps.isResolved).toBe(false);
            expect(lastThreadedAnnotationProps.isAnnotations).toBe(false);
        });

        test('should call onCommentDelete with id and permissions when onDelete fires', () => {
            const onCommentDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentDelete={onCommentDelete} />);

            const onDelete = lastThreadedAnnotationProps.onDelete as (id: string) => void;
            onDelete('comment-1');

            expect(onCommentDelete).toHaveBeenCalledWith({ id: 'comment-1', permissions: commentPermissions });
        });

        test('should call onCommentDelete with thread id when onThreadDelete fires', () => {
            const onCommentDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentDelete={onCommentDelete} />);

            const onThreadDelete = lastThreadedAnnotationProps.onThreadDelete as () => void;
            onThreadDelete();

            expect(onCommentDelete).toHaveBeenCalledWith({ id: 'comment-1', permissions: commentPermissions });
        });

        test('should call onCommentUpdate with resolved status when onResolve fires', () => {
            const onCommentUpdate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentUpdate={onCommentUpdate} />);

            const onResolve = lastThreadedAnnotationProps.onResolve as (id: string) => void;
            onResolve('comment-1');

            expect(onCommentUpdate).toHaveBeenCalledWith(
                'comment-1',
                'Hello world',
                'resolved',
                false,
                commentPermissions,
            );
        });

        test('should call onCommentUpdate with open status when onUnresolve fires', () => {
            const onCommentUpdate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentUpdate={onCommentUpdate} />);

            const onUnresolve = lastThreadedAnnotationProps.onUnresolve as (id: string) => void;
            onUnresolve('comment-1');

            expect(onCommentUpdate).toHaveBeenCalledWith('comment-1', 'Hello world', 'open', false, commentPermissions);
        });

        test('should call onReplyCreate via onPost with serialized text', async () => {
            const onReplyCreate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onReplyCreate={onReplyCreate} />);

            const onPost = lastThreadedAnnotationProps.onPost as (content: unknown) => Promise<void>;
            await onPost({ type: 'doc', content: [] });

            expect(onReplyCreate).toHaveBeenCalledWith('comment-1', 'comment', 'serialized-text');
        });
    });

    describe('annotation rendering', () => {
        test('should render an annotation as ThreadedAnnotation', () => {
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} />);
            expect(screen.getByRole('article', { name: 'threaded annotation' })).toBeVisible();
        });

        test('should call onAnnotationSelect when onAnnotationBadgeClick fires', () => {
            const onAnnotationSelect = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onAnnotationSelect={onAnnotationSelect} />);

            const onAnnotationBadgeClick = lastThreadedAnnotationProps.onAnnotationBadgeClick as () => void;
            onAnnotationBadgeClick();

            expect(onAnnotationSelect).toHaveBeenCalledWith(mockAnnotation.annotation);
        });

        test('should call onAnnotationDelete with id and permissions when onDelete fires', () => {
            const onAnnotationDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onAnnotationDelete={onAnnotationDelete} />);

            const onDelete = lastThreadedAnnotationProps.onDelete as (id: string) => void;
            onDelete('annotation-1');

            expect(onAnnotationDelete).toHaveBeenCalledWith({ id: 'annotation-1', permissions: annotationPermissions });
        });

        test('should call onAnnotationDelete with thread id when onThreadDelete fires', () => {
            const onAnnotationDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onAnnotationDelete={onAnnotationDelete} />);

            const onThreadDelete = lastThreadedAnnotationProps.onThreadDelete as () => void;
            onThreadDelete();

            expect(onAnnotationDelete).toHaveBeenCalledWith({ id: 'annotation-1', permissions: annotationPermissions });
        });

        test('should call onAnnotationStatusChange with resolved when onResolve fires', () => {
            const onAnnotationStatusChange = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={mockAnnotation}
                    onAnnotationStatusChange={onAnnotationStatusChange}
                />,
            );

            const onResolve = lastThreadedAnnotationProps.onResolve as (id: string) => void;
            onResolve('annotation-1');

            expect(onAnnotationStatusChange).toHaveBeenCalledWith({
                id: 'annotation-1',
                permissions: annotationPermissions,
                status: 'resolved',
            });
        });

        test('should call onAnnotationStatusChange with open when onUnresolve fires', () => {
            const onAnnotationStatusChange = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={mockAnnotation}
                    onAnnotationStatusChange={onAnnotationStatusChange}
                />,
            );

            const onUnresolve = lastThreadedAnnotationProps.onUnresolve as (id: string) => void;
            onUnresolve('annotation-1');

            expect(onAnnotationStatusChange).toHaveBeenCalledWith({
                id: 'annotation-1',
                permissions: annotationPermissions,
                status: 'open',
            });
        });

        test('should pass point badge for point annotation target', () => {
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} />);
            expect(lastThreadedAnnotationProps.annotationTarget).toEqual({ page: 3, type: 'point' });
        });

        test('should pass region badge for region annotation target', () => {
            const regionAnnotation: TransformedAnnotationItem = {
                ...mockAnnotation,
                annotation: {
                    ...mockAnnotation.annotation,
                    target: {
                        location: { type: 'page', value: 2 },
                        shape: { height: 10, type: 'rect', width: 20, x: 5, y: 5 },
                        type: 'region',
                    },
                } as TransformedAnnotationItem['annotation'],
            };
            render(<FeedItemRow {...defaultProps} item={regionAnnotation} />);
            expect(lastThreadedAnnotationProps.annotationTarget).toEqual({ page: 2, type: 'region' });
        });

        test('should pass drawing badge for drawing annotation target', () => {
            const drawingAnnotation: TransformedAnnotationItem = {
                ...mockAnnotation,
                annotation: {
                    ...mockAnnotation.annotation,
                    target: { location: { type: 'page', value: 1 }, type: 'drawing' },
                } as TransformedAnnotationItem['annotation'],
            };
            render(<FeedItemRow {...defaultProps} item={drawingAnnotation} />);
            expect(lastThreadedAnnotationProps.annotationTarget).toEqual({ page: 1, type: 'drawing' });
        });

        test('should pass highlight badge with empty text for highlight annotation target', () => {
            const highlightAnnotation: TransformedAnnotationItem = {
                ...mockAnnotation,
                annotation: {
                    ...mockAnnotation.annotation,
                    target: { location: { type: 'page', value: 1 }, type: 'highlight' },
                } as TransformedAnnotationItem['annotation'],
            };
            render(<FeedItemRow {...defaultProps} item={highlightAnnotation} />);
            expect(lastThreadedAnnotationProps.annotationTarget).toEqual({ highlightedText: '', type: 'highlight' });
        });

        test('should pass undefined badge for unknown annotation target type', () => {
            const unknownAnnotation: TransformedAnnotationItem = {
                ...mockAnnotation,
                annotation: {
                    ...mockAnnotation.annotation,
                    target: { location: { type: 'page', value: 1 }, type: 'unknown' },
                } as TransformedAnnotationItem['annotation'],
            };
            render(<FeedItemRow {...defaultProps} item={unknownAnnotation} />);
            expect(lastThreadedAnnotationProps.annotationTarget).toBeUndefined();
        });

        test('should call onReplyCreate via onPost with annotation type', async () => {
            const onReplyCreate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onReplyCreate={onReplyCreate} />);

            const onPost = lastThreadedAnnotationProps.onPost as (content: unknown) => Promise<void>;
            await onPost({ type: 'doc', content: [] });

            expect(onReplyCreate).toHaveBeenCalledWith('annotation-1', 'annotation', 'serialized-text');
        });
    });

    describe('task rendering', () => {
        test('should render a task and pass disabled prop', () => {
            render(<FeedItemRow {...defaultProps} isDisabled item={mockTask} />);
            expect(screen.getByRole('article', { name: 'task' })).toBeVisible();
            expect(lastTaskProps.disabled).toBe(true);
        });

        test('should call onTaskDelete when delete fires', () => {
            const onTaskDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockTask} onTaskDelete={onTaskDelete} />);

            const onDelete = lastTaskProps.onDelete as () => void;
            onDelete();

            expect(onTaskDelete).toHaveBeenCalledWith(mockOriginalTask);
        });

        test('should call onTaskView with taskId and isCreator when view fires', () => {
            const onTaskView = jest.fn();
            render(<FeedItemRow {...defaultProps} currentUserId="user-1" item={mockTask} onTaskView={onTaskView} />);

            const onView = lastTaskProps.onView as (taskId: string) => void;
            onView('task-1');

            expect(onTaskView).toHaveBeenCalledWith('task-1', true);
        });

        test('should pass isCreator false when currentUserId does not match author', () => {
            const onTaskView = jest.fn();
            render(
                <FeedItemRow {...defaultProps} currentUserId="other-user" item={mockTask} onTaskView={onTaskView} />,
            );

            const onView = lastTaskProps.onView as (taskId: string) => void;
            onView('task-1');

            expect(onTaskView).toHaveBeenCalledWith('task-1', false);
        });
    });

    describe('version rendering', () => {
        test('should render a version item', () => {
            render(<FeedItemRow {...defaultProps} item={mockVersion} />);
            expect(screen.getByRole('article', { name: 'version' })).toBeVisible();
        });

        test('should remap onVersionClick args to snake_case when version is clicked', () => {
            const onVersionHistoryClick = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockVersion} onVersionHistoryClick={onVersionHistoryClick} />);

            const onVersionClick = lastVersionProps.onVersionClick as (info: {
                id: string;
                versionNumber: number;
            }) => void;
            onVersionClick({ id: 'version-1', versionNumber: 5 });

            expect(onVersionHistoryClick).toHaveBeenCalledWith({ id: 'version-1', version_number: 5 });
        });
    });

    describe('app activity rendering', () => {
        test('should render an app activity item', () => {
            render(<FeedItemRow {...defaultProps} item={mockAppActivity} />);
            expect(screen.getByRole('article', { name: 'app activity' })).toBeVisible();
        });
    });

    describe('callbacks not provided', () => {
        test('should not throw when comment callbacks are not provided', () => {
            render(<FeedItemRow {...defaultProps} item={mockComment} />);

            const onDelete = lastThreadedAnnotationProps.onDelete as (id: string) => void;
            const onResolve = lastThreadedAnnotationProps.onResolve as (id: string) => void;
            const onUnresolve = lastThreadedAnnotationProps.onUnresolve as (id: string) => void;
            const onThreadDelete = lastThreadedAnnotationProps.onThreadDelete as () => void;

            expect(() => onDelete('c1')).not.toThrow();
            expect(() => onResolve('c1')).not.toThrow();
            expect(() => onUnresolve('c1')).not.toThrow();
            expect(() => onThreadDelete()).not.toThrow();
        });

        test('should not throw when annotation callbacks are not provided', () => {
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} />);

            const onDelete = lastThreadedAnnotationProps.onDelete as (id: string) => void;
            const onResolve = lastThreadedAnnotationProps.onResolve as (id: string) => void;
            const onAnnotationBadgeClick = lastThreadedAnnotationProps.onAnnotationBadgeClick as () => void;
            const onThreadDelete = lastThreadedAnnotationProps.onThreadDelete as () => void;

            expect(() => onDelete('a1')).not.toThrow();
            expect(() => onResolve('a1')).not.toThrow();
            expect(() => onAnnotationBadgeClick()).not.toThrow();
            expect(() => onThreadDelete()).not.toThrow();
        });
    });
});
