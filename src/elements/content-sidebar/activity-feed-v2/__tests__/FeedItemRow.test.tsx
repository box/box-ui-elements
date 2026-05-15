import * as React from 'react';

import { AnnotationBadgeType } from '@box/threaded-annotations';
import type { AnnotationBadgeTargetType, ThreadedAnnotationsPropsV2 } from '@box/threaded-annotations';

import { render, screen } from '../../../../test-utils/testing-library';
import FeedItemRow from '../FeedItemRow';
import { dispatchReplyEdit, logEditError, serializeEditorContent } from '../helpers';
import { annotationTargetToBadge } from '../transformers';

import type { TaskNew } from '../../../../common/types/tasks';
import type {
    TaskItemProps,
    TransformedAnnotationItem,
    TransformedCommentItem,
    TransformedFeedItem,
    UserSelectorProps,
    VersionItemProps,
} from '../types';

let lastThreadedAnnotationProps: Partial<ThreadedAnnotationsPropsV2> = {};
let lastTaskProps: Partial<TaskItemProps> = {};
let lastVersionProps: Partial<VersionItemProps> = {};

jest.mock('@box/activity-feed', () => {
    const ActivityFeedList = ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>;
    ActivityFeedList.AppActivity = (props: { id: string }) => <article aria-label="app activity">{props.id}</article>;
    ActivityFeedList.Task = (props: Partial<TaskItemProps>) => {
        lastTaskProps = props;
        return <article aria-label="task">{String(props.id)}</article>;
    };
    ActivityFeedList.ThreadedAnnotation = (props: Partial<ThreadedAnnotationsPropsV2>) => {
        lastThreadedAnnotationProps = props;
        return <article aria-label="threaded annotation">{String(props.isResolved)}</article>;
    };
    ActivityFeedList.Version = (props: Partial<VersionItemProps>) => {
        lastVersionProps = props;
        return <article aria-label="version">{String(props.id)}</article>;
    };
    return { ActivityFeed: { List: ActivityFeedList } };
});

jest.mock('../helpers', () => ({
    dispatchReplyEdit: jest.fn(),
    logEditError: jest.fn(),
    serializeEditorContent: jest.fn(),
}));

jest.mock('../transformers', () => ({
    ...jest.requireActual('../transformers'),
    annotationTargetToBadge: jest.fn(),
}));

const mockedSerializeEditorContent = jest.mocked(serializeEditorContent);
const mockedDispatchReplyEdit = jest.mocked(dispatchReplyEdit);
const mockedAnnotationTargetToBadge = jest.mocked(annotationTargetToBadge);

const userSelectorProps: UserSelectorProps = {
    ariaRoleDescription: 'user selector',
    fetchAvatarUrls: () => Promise.resolve({}),
    fetchUsers: () => Promise.resolve([]),
    loadingAriaLabel: 'Loading...',
};

const commentPermissions = { can_delete: true, can_edit: true, can_reply: true, can_resolve: true };

const replyPermissions = { canDelete: true, canEdit: true, canReply: false, canResolve: false };

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
        {
            id: 'reply-1',
            message: { type: 'doc', content: [] },
            createdAt: 0,
            author: { name: 'User', id: 1, email: 'u@b.com' },
            permissions: replyPermissions,
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
        {
            id: 'annotation-reply-1',
            message: { type: 'doc', content: [] },
            createdAt: 0,
            author: { name: 'User', id: 1, email: 'u@b.com' },
            permissions: replyPermissions,
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
        mockedSerializeEditorContent.mockReturnValue({ hasMention: false, text: 'serialized-text' });
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

            lastThreadedAnnotationProps.onDelete?.('comment-1');

            expect(onCommentDelete).toHaveBeenCalledWith({ id: 'comment-1', permissions: commentPermissions });
        });

        test('should call onCommentDelete with thread id when onThreadDelete fires', () => {
            const onCommentDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentDelete={onCommentDelete} />);

            lastThreadedAnnotationProps.onThreadDelete?.();

            expect(onCommentDelete).toHaveBeenCalledWith({ id: 'comment-1', permissions: commentPermissions });
        });

        test('should call onCommentUpdate with resolved status when onResolve fires', () => {
            const onCommentUpdate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentUpdate={onCommentUpdate} />);

            lastThreadedAnnotationProps.onResolve?.('comment-1');

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

            lastThreadedAnnotationProps.onUnresolve?.('comment-1');

            expect(onCommentUpdate).toHaveBeenCalledWith('comment-1', 'Hello world', 'open', false, commentPermissions);
        });

        test('should call onReplyCreate via onPost with serialized text', async () => {
            const onReplyCreate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onReplyCreate={onReplyCreate} />);

            await lastThreadedAnnotationProps.onPost?.({ type: 'doc', content: [] });

            expect(onReplyCreate).toHaveBeenCalledWith('comment-1', 'comment', 'serialized-text');
        });

        test('should pass isEditDisabled=false when not disabled and not resolved', () => {
            render(<FeedItemRow {...defaultProps} item={mockComment} />);
            expect(lastThreadedAnnotationProps.isEditDisabled).toBe(false);
        });

        test('should pass isEditDisabled=true when resolved', () => {
            render(<FeedItemRow {...defaultProps} item={{ ...mockComment, isResolved: true }} />);
            expect(lastThreadedAnnotationProps.isEditDisabled).toBe(true);
        });

        test('should route onEdit of root id to onCommentUpdate with serialized text and hasMention', () => {
            mockedSerializeEditorContent.mockReturnValue({ hasMention: true, text: 'edited-text' });
            const onCommentUpdate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentUpdate={onCommentUpdate} />);

            lastThreadedAnnotationProps.onEdit?.('comment-1', { type: 'doc', content: [] });

            expect(onCommentUpdate).toHaveBeenCalledWith(
                'comment-1',
                'edited-text',
                undefined,
                true,
                commentPermissions,
            );
        });

        test('should delegate onEdit of a reply id to dispatchReplyEdit with messages, parent id, and reply text', () => {
            mockedSerializeEditorContent.mockReturnValue({ hasMention: false, text: 'edited-reply' });
            const onReplyUpdate = jest.fn();
            const onCommentUpdate = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={mockComment}
                    onCommentUpdate={onCommentUpdate}
                    onReplyUpdate={onReplyUpdate}
                />,
            );

            lastThreadedAnnotationProps.onEdit?.('reply-1', { type: 'doc', content: [] });

            expect(mockedDispatchReplyEdit).toHaveBeenCalledWith({
                id: 'reply-1',
                messages: mockComment.messages,
                onReplyUpdate,
                parentId: 'comment-1',
                text: 'edited-reply',
            });
            expect(onCommentUpdate).not.toHaveBeenCalled();
        });

        test('should pass onCopyLink with the clicked message id when onCommentCopyLink is provided', () => {
            const onCommentCopyLink = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockComment} onCommentCopyLink={onCommentCopyLink} />);

            lastThreadedAnnotationProps.onCopyLink?.('reply-1');

            expect(onCommentCopyLink).toHaveBeenCalledWith({ id: 'reply-1' });
        });

        test('should omit onCopyLink when onCommentCopyLink is not provided', () => {
            render(<FeedItemRow {...defaultProps} item={mockComment} />);
            expect(lastThreadedAnnotationProps.onCopyLink).toBeUndefined();
        });

        test('should skip onEdit when serializer returns null', () => {
            mockedSerializeEditorContent.mockReturnValue(null);
            const onCommentUpdate = jest.fn();
            const onReplyUpdate = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={mockComment}
                    onCommentUpdate={onCommentUpdate}
                    onReplyUpdate={onReplyUpdate}
                />,
            );

            lastThreadedAnnotationProps.onEdit?.('comment-1', { type: 'doc', content: [] });

            expect(onCommentUpdate).not.toHaveBeenCalled();
            expect(onReplyUpdate).not.toHaveBeenCalled();
        });

        test('should skip onEdit when serialized text is whitespace only', () => {
            mockedSerializeEditorContent.mockReturnValue({ hasMention: false, text: '   \n\t  ' });
            const onCommentUpdate = jest.fn();
            const onReplyUpdate = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={mockComment}
                    onCommentUpdate={onCommentUpdate}
                    onReplyUpdate={onReplyUpdate}
                />,
            );

            lastThreadedAnnotationProps.onEdit?.('comment-1', { type: 'doc', content: [] });
            lastThreadedAnnotationProps.onEdit?.('reply-1', { type: 'doc', content: [] });

            expect(onCommentUpdate).not.toHaveBeenCalled();
            expect(onReplyUpdate).not.toHaveBeenCalled();
        });

        test('should wire onEditError to the logEditError helper', () => {
            render(<FeedItemRow {...defaultProps} item={mockComment} />);
            expect(lastThreadedAnnotationProps.onEditError).toBe(logEditError);
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

            lastThreadedAnnotationProps.onAnnotationBadgeClick?.('annotation-1');

            expect(onAnnotationSelect).toHaveBeenCalledWith(mockAnnotation.annotation);
        });

        test('should call onAnnotationDelete with id and permissions when onDelete fires', () => {
            const onAnnotationDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onAnnotationDelete={onAnnotationDelete} />);

            lastThreadedAnnotationProps.onDelete?.('annotation-1');

            expect(onAnnotationDelete).toHaveBeenCalledWith({ id: 'annotation-1', permissions: annotationPermissions });
        });

        test('should call onAnnotationDelete with thread id when onThreadDelete fires', () => {
            const onAnnotationDelete = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onAnnotationDelete={onAnnotationDelete} />);

            lastThreadedAnnotationProps.onThreadDelete?.();

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

            lastThreadedAnnotationProps.onResolve?.('annotation-1');

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

            lastThreadedAnnotationProps.onUnresolve?.('annotation-1');

            expect(onAnnotationStatusChange).toHaveBeenCalledWith({
                id: 'annotation-1',
                permissions: annotationPermissions,
                status: 'open',
            });
        });

        test('should map the annotation target through annotationTargetToBadge and forward the result', () => {
            const badge: AnnotationBadgeTargetType = { page: 7, type: AnnotationBadgeType.Drawing };
            mockedAnnotationTargetToBadge.mockReturnValue(badge);

            render(<FeedItemRow {...defaultProps} item={mockAnnotation} />);

            expect(annotationTargetToBadge).toHaveBeenCalledWith(mockAnnotation.annotation.target);
            expect(lastThreadedAnnotationProps.annotationTarget).toBe(badge);
        });

        test('should call onReplyCreate via onPost with annotation type', async () => {
            const onReplyCreate = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onReplyCreate={onReplyCreate} />);

            await lastThreadedAnnotationProps.onPost?.({ type: 'doc', content: [] });

            expect(onReplyCreate).toHaveBeenCalledWith('annotation-1', 'annotation', 'serialized-text');
        });

        test('should pass isEditDisabled=true when resolved', () => {
            render(<FeedItemRow {...defaultProps} item={{ ...mockAnnotation, isResolved: true }} />);
            expect(lastThreadedAnnotationProps.isEditDisabled).toBe(true);
        });

        test('should route onEdit of root id to onAnnotationEdit with serialized text', () => {
            mockedSerializeEditorContent.mockReturnValue({ hasMention: false, text: 'edited-annotation' });
            const onAnnotationEdit = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onAnnotationEdit={onAnnotationEdit} />);

            lastThreadedAnnotationProps.onEdit?.('annotation-1', { type: 'doc', content: [] });

            expect(onAnnotationEdit).toHaveBeenCalledWith({
                id: 'annotation-1',
                permissions: annotationPermissions,
                text: 'edited-annotation',
            });
        });

        test('should delegate onEdit of a reply id to dispatchReplyEdit with messages, parent id, and reply text', () => {
            mockedSerializeEditorContent.mockReturnValue({ hasMention: false, text: 'edited-reply' });
            const onAnnotationEdit = jest.fn();
            const onReplyUpdate = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={mockAnnotation}
                    onAnnotationEdit={onAnnotationEdit}
                    onReplyUpdate={onReplyUpdate}
                />,
            );

            lastThreadedAnnotationProps.onEdit?.('annotation-reply-1', { type: 'doc', content: [] });

            expect(mockedDispatchReplyEdit).toHaveBeenCalledWith({
                id: 'annotation-reply-1',
                messages: mockAnnotation.messages,
                onReplyUpdate,
                parentId: 'annotation-1',
                text: 'edited-reply',
            });
            expect(onAnnotationEdit).not.toHaveBeenCalled();
        });

        test('should pass onCopyLink with annotationId (thread root) and fileVersionId regardless of which message was clicked', () => {
            const onAnnotationCopyLink = jest.fn();
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} onAnnotationCopyLink={onAnnotationCopyLink} />);

            lastThreadedAnnotationProps.onCopyLink?.('annotation-reply-1');

            expect(onAnnotationCopyLink).toHaveBeenCalledWith({ annotationId: 'annotation-1', fileVersionId: 'fv1' });
        });

        test('should omit onCopyLink when onAnnotationCopyLink is not provided', () => {
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} />);
            expect(lastThreadedAnnotationProps.onCopyLink).toBeUndefined();
        });

        test('should omit onCopyLink when annotation has no file_version', () => {
            const annotationWithoutVersion = {
                ...mockAnnotation,
                annotation: { ...mockAnnotation.annotation, file_version: null },
            };
            const onAnnotationCopyLink = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={annotationWithoutVersion}
                    onAnnotationCopyLink={onAnnotationCopyLink}
                />,
            );
            expect(lastThreadedAnnotationProps.onCopyLink).toBeUndefined();
        });

        test('should skip onEdit when serialized text is whitespace only', () => {
            mockedSerializeEditorContent.mockReturnValue({ hasMention: false, text: '   \n\t  ' });
            const onAnnotationEdit = jest.fn();
            const onReplyUpdate = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    item={mockAnnotation}
                    onAnnotationEdit={onAnnotationEdit}
                    onReplyUpdate={onReplyUpdate}
                />,
            );

            lastThreadedAnnotationProps.onEdit?.('annotation-1', { type: 'doc', content: [] });
            lastThreadedAnnotationProps.onEdit?.('annotation-reply-1', { type: 'doc', content: [] });

            expect(onAnnotationEdit).not.toHaveBeenCalled();
            expect(onReplyUpdate).not.toHaveBeenCalled();
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

            lastTaskProps.onDelete?.('task-1');

            expect(onTaskDelete).toHaveBeenCalledWith(mockOriginalTask);
        });

        test('should call onTaskView with taskId and isCreator when view fires', () => {
            const onTaskView = jest.fn();
            render(<FeedItemRow {...defaultProps} currentUserId="user-1" item={mockTask} onTaskView={onTaskView} />);

            lastTaskProps.onView?.('task-1');

            expect(onTaskView).toHaveBeenCalledWith('task-1', true);
        });

        test('should pass isCreator false when currentUserId does not match author', () => {
            const onTaskView = jest.fn();
            render(
                <FeedItemRow {...defaultProps} currentUserId="other-user" item={mockTask} onTaskView={onTaskView} />,
            );

            lastTaskProps.onView?.('task-1');

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

            lastVersionProps.onVersionClick?.({ id: 'version-1', versionNumber: 5 });

            expect(onVersionHistoryClick).toHaveBeenCalledWith({ id: 'version-1', version_number: 5 });
        });
    });

    describe('app activity rendering', () => {
        test('should render an app activity item', () => {
            render(<FeedItemRow {...defaultProps} item={mockAppActivity} />);
            expect(screen.getByRole('article', { name: 'app activity' })).toBeVisible();
        });
    });

    describe('isDisabled', () => {
        test('should not fire comment mutation callbacks (delete, resolve, unresolve, reply, edit) when isDisabled', async () => {
            const onCommentDelete = jest.fn();
            const onCommentUpdate = jest.fn();
            const onReplyCreate = jest.fn();
            const onReplyUpdate = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    isDisabled
                    item={mockComment}
                    onCommentDelete={onCommentDelete}
                    onCommentUpdate={onCommentUpdate}
                    onReplyCreate={onReplyCreate}
                    onReplyUpdate={onReplyUpdate}
                />,
            );

            lastThreadedAnnotationProps.onDelete?.('comment-1');
            lastThreadedAnnotationProps.onThreadDelete?.();
            lastThreadedAnnotationProps.onResolve?.('comment-1');
            lastThreadedAnnotationProps.onUnresolve?.('comment-1');
            await lastThreadedAnnotationProps.onPost?.({ type: 'doc', content: [] });
            lastThreadedAnnotationProps.onEdit?.('comment-1', { type: 'doc', content: [] });
            lastThreadedAnnotationProps.onEdit?.('reply-1', { type: 'doc', content: [] });

            expect(onCommentDelete).not.toHaveBeenCalled();
            expect(onCommentUpdate).not.toHaveBeenCalled();
            expect(onReplyCreate).not.toHaveBeenCalled();
            expect(onReplyUpdate).not.toHaveBeenCalled();
            expect(lastThreadedAnnotationProps.isEditDisabled).toBe(true);
        });

        test('should not fire annotation mutation callbacks (delete, resolve, unresolve, reply, edit) when isDisabled', async () => {
            const onAnnotationDelete = jest.fn();
            const onAnnotationEdit = jest.fn();
            const onAnnotationStatusChange = jest.fn();
            const onReplyCreate = jest.fn();
            const onReplyUpdate = jest.fn();
            render(
                <FeedItemRow
                    {...defaultProps}
                    isDisabled
                    item={mockAnnotation}
                    onAnnotationDelete={onAnnotationDelete}
                    onAnnotationEdit={onAnnotationEdit}
                    onAnnotationStatusChange={onAnnotationStatusChange}
                    onReplyCreate={onReplyCreate}
                    onReplyUpdate={onReplyUpdate}
                />,
            );

            lastThreadedAnnotationProps.onDelete?.('annotation-1');
            lastThreadedAnnotationProps.onThreadDelete?.();
            lastThreadedAnnotationProps.onResolve?.('annotation-1');
            lastThreadedAnnotationProps.onUnresolve?.('annotation-1');
            await lastThreadedAnnotationProps.onPost?.({ type: 'doc', content: [] });
            lastThreadedAnnotationProps.onEdit?.('annotation-1', { type: 'doc', content: [] });
            lastThreadedAnnotationProps.onEdit?.('annotation-reply-1', { type: 'doc', content: [] });

            expect(onAnnotationDelete).not.toHaveBeenCalled();
            expect(onAnnotationEdit).not.toHaveBeenCalled();
            expect(onAnnotationStatusChange).not.toHaveBeenCalled();
            expect(onReplyCreate).not.toHaveBeenCalled();
            expect(onReplyUpdate).not.toHaveBeenCalled();
            expect(lastThreadedAnnotationProps.isEditDisabled).toBe(true);
        });
    });

    describe('callbacks not provided', () => {
        test('should not throw when comment callbacks are not provided', () => {
            render(<FeedItemRow {...defaultProps} item={mockComment} />);

            expect(() => lastThreadedAnnotationProps.onDelete?.('c1')).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onResolve?.('c1')).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onUnresolve?.('c1')).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onThreadDelete?.()).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onEdit?.('comment-1', { type: 'doc', content: [] })).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onEdit?.('reply-1', { type: 'doc', content: [] })).not.toThrow();
        });

        test('should not throw when annotation callbacks are not provided', () => {
            render(<FeedItemRow {...defaultProps} item={mockAnnotation} />);

            expect(() => lastThreadedAnnotationProps.onDelete?.('a1')).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onResolve?.('a1')).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onAnnotationBadgeClick?.('a1')).not.toThrow();
            expect(() => lastThreadedAnnotationProps.onThreadDelete?.()).not.toThrow();
            expect(() =>
                lastThreadedAnnotationProps.onEdit?.('annotation-1', { type: 'doc', content: [] }),
            ).not.toThrow();
            expect(() =>
                lastThreadedAnnotationProps.onEdit?.('annotation-reply-1', { type: 'doc', content: [] }),
            ).not.toThrow();
        });
    });
});
