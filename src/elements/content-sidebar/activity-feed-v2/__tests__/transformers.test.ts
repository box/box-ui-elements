import type { Annotation } from '../../../../common/types/annotations';
import type { AppActivityItem, Comment, FeedItem } from '../../../../common/types/feed';
import type { BoxItemVersion } from '../../../../common/types/core';
import type { TaskNew } from '../../../../common/types/tasks';

import {
    annotationTargetToBadge,
    extractTimestampMarkup,
    textToDocumentNode,
    transformAnnotationToMessages,
    transformAppActivityToProps,
    transformCommentToMessages,
    transformFeedItem,
    transformTaskToProps,
    transformVersionToProps,
} from '../transformers';

describe('elements/content-sidebar/activity-feed-v2/transformers', () => {
    describe('textToDocumentNode()', () => {
        test('should convert single-line text to a document node', () => {
            const result = textToDocumentNode('Hello world', '');
            expect(result).toEqual({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Hello world' }],
                    },
                ],
            });
        });

        test('should convert multi-line text to multiple paragraphs', () => {
            const result = textToDocumentNode('Line 1\nLine 2\nLine 3', '');
            expect(result.content).toHaveLength(3);
            expect(result.content[0].content).toEqual([{ type: 'text', text: 'Line 1' }]);
            expect(result.content[1].content).toEqual([{ type: 'text', text: 'Line 2' }]);
            expect(result.content[2].content).toEqual([{ type: 'text', text: 'Line 3' }]);
        });

        test('should handle empty lines as paragraphs without content key', () => {
            const result = textToDocumentNode('Before\n\nAfter', '');
            expect(result.content).toHaveLength(3);
            expect(result.content[1]).toEqual({ type: 'paragraph' });
        });

        test('should handle empty string', () => {
            const result = textToDocumentNode('', '');
            expect(result).toEqual({ type: 'doc', content: [] });
        });

        test('should parse @[id:name] mentions into mention nodes', () => {
            const result = textToDocumentNode('Hello @[123:Jane Doe] how are you?', '');
            expect(result.content).toHaveLength(1);
            expect(result.content[0].content).toEqual([
                { type: 'text', text: 'Hello ' },
                {
                    type: 'mention',
                    attrs: {
                        authorId: '',
                        mentionId: '123',
                        mentionedUserId: '123',
                        mentionedUserName: 'Jane Doe',
                    },
                },
                { type: 'text', text: ' how are you?' },
            ]);
        });

        test('should parse multiple mentions in one line', () => {
            const result = textToDocumentNode('@[1:Alice] and @[2:Bob]', '');
            expect(result.content[0].content).toHaveLength(3);
            expect(result.content[0].content[0]).toEqual({
                type: 'mention',
                attrs: { authorId: '', mentionId: '1', mentionedUserId: '1', mentionedUserName: 'Alice' },
            });
            expect(result.content[0].content[1]).toEqual({ type: 'text', text: ' and ' });
            expect(result.content[0].content[2]).toEqual({
                type: 'mention',
                attrs: { authorId: '', mentionId: '2', mentionedUserId: '2', mentionedUserName: 'Bob' },
            });
        });

        test('should handle mentions across multiple lines', () => {
            const result = textToDocumentNode('Hi @[1:Alice]\nBye @[2:Bob]', '');
            expect(result.content).toHaveLength(2);
            expect(result.content[0].content[1].type).toBe('mention');
            expect(result.content[1].content[1].type).toBe('mention');
        });

        test('should pass authorId through to each mention node', () => {
            const result = textToDocumentNode('@[1:Alice] and @[2:Bob]', '99');
            expect(result.content[0].content[0]).toEqual({
                type: 'mention',
                attrs: { authorId: '99', mentionId: '1', mentionedUserId: '1', mentionedUserName: 'Alice' },
            });
            expect(result.content[0].content[2]).toEqual({
                type: 'mention',
                attrs: { authorId: '99', mentionId: '2', mentionedUserId: '2', mentionedUserName: 'Bob' },
            });
        });
    });

    describe('transformCommentToMessages()', () => {
        const mockComment = {
            created_at: '2024-01-01T00:00:00Z',
            created_by: {
                avatar_url: 'https://example.com/avatar.png',
                email: 'user@example.com',
                id: '123',
                name: 'Test User',
                type: 'user',
            },
            id: 'comment-1',
            message: 'fallback message',
            modified_at: '2024-01-01T00:00:00Z',
            permissions: {
                can_delete: true,
                can_edit: true,
                can_reply: true,
                can_resolve: false,
            },
            tagged_message: 'Hello @[456:Jane]',
            type: 'comment',
        };

        test('should transform a comment without replies to a single message', () => {
            const messages = transformCommentToMessages(mockComment as unknown as Comment);
            expect(messages).toHaveLength(1);
            expect(messages[0].id).toBe('comment-1');
            expect(messages[0].author.name).toBe('Test User');
            expect(messages[0].author.id).toBe(123);
            expect(messages[0].author.email).toBe('user@example.com');
            expect(messages[0].createdAt).toBe(new Date('2024-01-01T00:00:00Z').getTime());
            expect(messages[0].permissions.canDelete).toBe(true);
            expect(messages[0].permissions.canResolve).toBe(false);
        });

        test('should include replies as additional messages', () => {
            const commentWithReplies = {
                ...mockComment,
                replies: [
                    {
                        ...mockComment,
                        id: 'reply-1',
                        tagged_message: 'Reply text',
                        created_by: { ...mockComment.created_by, id: '789', name: 'Reply User' },
                    },
                ],
            };
            const messages = transformCommentToMessages(commentWithReplies as unknown as Comment);
            expect(messages).toHaveLength(2);
            expect(messages[1].id).toBe('reply-1');
            expect(messages[1].author.name).toBe('Reply User');
        });

        test('should use tagged_message over message and parse mentions with author id', () => {
            const messages = transformCommentToMessages(mockComment as unknown as Comment);
            expect(messages[0].message.content[0].content).toEqual([
                { type: 'text', text: 'Hello ' },
                {
                    type: 'mention',
                    attrs: { authorId: '123', mentionId: '456', mentionedUserId: '456', mentionedUserName: 'Jane' },
                },
            ]);
        });

        test('should fall back to message when tagged_message is empty', () => {
            const commentWithoutTagged = { ...mockComment, tagged_message: '' };
            const messages = transformCommentToMessages(commentWithoutTagged as unknown as Comment);
            expect(messages[0].message.content[0].content[0]).toEqual({
                type: 'text',
                text: 'fallback message',
            });
        });

        test('should leave updatedAt undefined when comment has not been edited', () => {
            const messages = transformCommentToMessages(mockComment as unknown as Comment);
            expect(messages[0].updatedAt).toBeUndefined();
        });

        test('should set updatedAt to modified_at when comment has been edited', () => {
            const editedComment = { ...mockComment, modified_at: '2024-01-02T00:00:00Z' };
            const messages = transformCommentToMessages(editedComment as unknown as Comment);
            expect(messages[0].updatedAt).toBe(new Date('2024-01-02T00:00:00Z').getTime());
        });
    });

    describe('transformAnnotationToMessages()', () => {
        const mockAnnotation = {
            created_at: '2024-02-01T00:00:00Z',
            created_by: {
                avatar_url: 'https://example.com/avatar2.png',
                email: 'annotator@example.com',
                id: '456',
                name: 'Annotator',
                type: 'user',
            },
            description: { message: 'Annotation text' },
            file_version: { id: 'fv-1', type: 'version', version_number: '1' },
            id: 'annotation-1',
            modified_at: '2024-02-01T00:00:00Z',
            modified_by: { id: '456', name: 'Annotator', type: 'user' },
            permissions: {
                can_delete: true,
                can_edit: true,
                can_reply: true,
                can_resolve: true,
            },
            target: { location: { type: 'page', value: 3 }, type: 'point', x: 10, y: 20 },
            type: 'annotation',
        };

        test('should transform an annotation to messages', () => {
            const messages = transformAnnotationToMessages(mockAnnotation as unknown as Annotation);
            expect(messages).toHaveLength(1);
            expect(messages[0].id).toBe('annotation-1');
            expect(messages[0].author.name).toBe('Annotator');
            expect(messages[0].message.content[0].content[0]).toEqual({
                type: 'text',
                text: 'Annotation text',
            });
        });

        test('should handle annotation with replies', () => {
            const annotationWithReplies = {
                ...mockAnnotation,
                replies: [
                    {
                        created_at: '2024-02-02T00:00:00Z',
                        created_by: { id: '789', name: 'Replier', email: 'replier@example.com', type: 'user' },
                        id: 'reply-1',
                        message: 'Reply to annotation',
                        modified_at: '2024-02-02T00:00:00Z',
                        permissions: { can_delete: false, can_edit: false, can_reply: false, can_resolve: false },
                        tagged_message: 'Reply to annotation',
                        type: 'comment',
                    },
                ],
            };
            const messages = transformAnnotationToMessages(annotationWithReplies as unknown as Annotation);
            expect(messages).toHaveLength(2);
            expect(messages[1].id).toBe('reply-1');
        });

        test('should handle annotation without description', () => {
            const noDescription = { ...mockAnnotation, description: undefined };
            const messages = transformAnnotationToMessages(noDescription as unknown as Annotation);
            expect(messages[0].message).toEqual({ type: 'doc', content: [] });
        });

        test('should leave updatedAt undefined when annotation has not been edited', () => {
            const messages = transformAnnotationToMessages(mockAnnotation as unknown as Annotation);
            expect(messages[0].updatedAt).toBeUndefined();
        });

        test('should set updatedAt to modified_at when annotation has been edited', () => {
            const editedAnnotation = { ...mockAnnotation, modified_at: '2024-02-05T00:00:00Z' };
            const messages = transformAnnotationToMessages(editedAnnotation as unknown as Annotation);
            expect(messages[0].updatedAt).toBe(new Date('2024-02-05T00:00:00Z').getTime());
        });

        test('should set authorId on mentions to the annotation creator id', () => {
            const annotationWithMention = { ...mockAnnotation, description: { message: 'cc @[789:Replier]' } };
            const messages = transformAnnotationToMessages(annotationWithMention as unknown as Annotation);
            const [, mentionNode] = messages[0].message.content[0].content as Array<{
                attrs?: { authorId: string };
            }>;
            expect(mentionNode.attrs?.authorId).toBe('456');
        });
    });

    describe('transformTaskToProps()', () => {
        const mockTask = {
            assigned_to: {
                entries: [
                    {
                        completed_at: null,
                        id: 'tc-1',
                        permissions: { can_delete: false, can_update: true },
                        role: 'ASSIGNEE',
                        status: 'NOT_STARTED',
                        target: {
                            avatar_url: 'https://example.com/assignee.png',
                            id: '100',
                            name: 'Assignee One',
                            type: 'user',
                        },
                        type: 'task_collaborator',
                    },
                ],
                limit: 20,
                next_marker: null,
            },
            completion_rule: 'ALL_ASSIGNEES',
            created_at: '2024-03-01T00:00:00Z',
            created_by: {
                id: 'tc-creator',
                role: 'CREATOR',
                status: 'NOT_STARTED',
                target: { id: '200', name: 'Creator', avatar_url: 'https://example.com/creator.png', type: 'user' },
                type: 'task_collaborator',
            },
            description: 'Please review this document',
            due_at: '2024-03-15T00:00:00Z',
            id: 'task-1',
            permissions: {
                can_create_task_collaborator: true,
                can_create_task_link: true,
                can_delete: true,
                can_update: true,
            },
            status: 'NOT_STARTED',
            task_links: { entries: [], limit: 20, next_marker: null },
            task_type: 'GENERAL',
            type: 'task',
        };

        test('should transform task with correct basic props', () => {
            const result = transformTaskToProps(mockTask as unknown as TaskNew, '200');
            expect(result.id).toBe('task-1');
            expect(result.currentUserId).toBe('200');
            expect(result.description).toBe('Please review this document');
            expect(result.taskType).toBe('GENERAL');
            expect(result.status).toBe('NOT_STARTED');
            expect(result.completionRule).toBe('ALL_ASSIGNEES');
        });

        test('should transform task assignees', () => {
            const result = transformTaskToProps(mockTask as unknown as TaskNew);
            expect(result.assignees).toHaveLength(1);
            expect(result.assignees[0]).toEqual({
                avatarUrl: undefined,
                completedAt: undefined,
                id: '100',
                name: 'Assignee One',
                permissions: { canDelete: false, canUpdate: true },
                status: 'NOT_STARTED',
            });
        });

        test('should transform task author from created_by.target', () => {
            const result = transformTaskToProps(mockTask as unknown as TaskNew);
            expect(result.author).toEqual({
                avatarUrl: undefined,
                id: '200',
                name: 'Creator',
            });
        });

        test('should transform task permissions', () => {
            const result = transformTaskToProps(mockTask as unknown as TaskNew);
            expect(result.permissions).toEqual({
                canCreateTaskCollaborator: true,
                canCreateTaskLink: true,
                canDelete: true,
                canUpdate: true,
            });
        });

        test('should convert due_at to dueDate in Unix ms', () => {
            const result = transformTaskToProps(mockTask as unknown as TaskNew);
            expect(result.dueDate).toBe(new Date('2024-03-15T00:00:00Z').getTime());
        });

        test('should handle APPROVAL task type', () => {
            const approvalTask = { ...mockTask, task_type: 'APPROVAL' };
            const result = transformTaskToProps(approvalTask as unknown as TaskNew);
            expect(result.taskType).toBe('APPROVAL');
        });

        test('should set fileCount from the number of task_links entries', () => {
            const multiFileTask = {
                ...mockTask,
                task_links: {
                    entries: [
                        { id: 'link-1', target: { id: 'file-1', type: 'file' }, type: 'task_link' },
                        { id: 'link-2', target: { id: 'file-2', type: 'file' }, type: 'task_link' },
                    ],
                    limit: 20,
                    next_marker: null,
                },
            };
            const result = transformTaskToProps(multiFileTask as unknown as TaskNew);
            expect(result.fileCount).toBe(2);
        });

        test('should set fileCount to undefined when task_links is missing', () => {
            const taskWithoutLinks = { ...mockTask, task_links: undefined };
            const result = transformTaskToProps(taskWithoutLinks as unknown as TaskNew);
            expect(result.fileCount).toBeUndefined();
        });

        test('should set hasNextPage=false when assigned_to.next_marker is null', () => {
            const result = transformTaskToProps(mockTask as unknown as TaskNew);
            expect(result.hasNextPage).toBe(false);
        });

        test('should set hasNextPage=true when assigned_to.next_marker is present', () => {
            const taskWithMore = {
                ...mockTask,
                assigned_to: { ...mockTask.assigned_to, next_marker: 'next-cursor' },
            };
            const result = transformTaskToProps(taskWithMore as unknown as TaskNew);
            expect(result.hasNextPage).toBe(true);
        });

        test('should use task-level completed_at when present', () => {
            const completedTask = {
                ...mockTask,
                completed_at: '2024-03-10T00:00:00Z',
                status: 'COMPLETED',
            };
            const result = transformTaskToProps(completedTask as unknown as TaskNew);
            expect(result.completedAt).toBe(new Date('2024-03-10T00:00:00Z').getTime());
        });

        test.each([['APPROVED'], ['COMPLETED'], ['REJECTED']])(
            'should fall back to latest assignee completed_at for terminal status %s',
            status => {
                const terminalTask = {
                    ...mockTask,
                    assigned_to: {
                        ...mockTask.assigned_to,
                        entries: [
                            {
                                ...mockTask.assigned_to.entries[0],
                                completed_at: '2024-03-08T00:00:00Z',
                                status,
                            },
                            {
                                ...mockTask.assigned_to.entries[0],
                                completed_at: '2024-03-09T00:00:00Z',
                                id: 'tc-2',
                                status,
                                target: { id: '101', name: 'Assignee Two', type: 'user' },
                            },
                        ],
                    },
                    status,
                };
                const result = transformTaskToProps(terminalTask as unknown as TaskNew);
                expect(result.completedAt).toBe(new Date('2024-03-09T00:00:00Z').getTime());
            },
        );

        test('should leave completedAt undefined for non-terminal status even when an assignee has completed_at', () => {
            const inProgressTask = {
                ...mockTask,
                assigned_to: {
                    ...mockTask.assigned_to,
                    entries: [
                        {
                            ...mockTask.assigned_to.entries[0],
                            completed_at: '2024-03-08T00:00:00Z',
                            status: 'APPROVED',
                        },
                    ],
                },
                status: 'IN_PROGRESS',
            };
            const result = transformTaskToProps(inProgressTask as unknown as TaskNew);
            expect(result.completedAt).toBeUndefined();
        });

        test('should leave completedAt undefined for terminal status when no assignee has completed_at', () => {
            const rejectedTask = { ...mockTask, status: 'REJECTED' };
            const result = transformTaskToProps(rejectedTask as unknown as TaskNew);
            expect(result.completedAt).toBeUndefined();
        });
    });

    describe('transformVersionToProps()', () => {
        const mockVersion = {
            action_type: 'created',
            created_at: '2024-04-01T00:00:00Z',
            id: 'version-1',
            modified_by: {
                avatar_url: 'https://example.com/uploader.png',
                id: '300',
                name: 'Uploader',
                type: 'user',
            },
            type: 'file_version',
            version_number: '5',
        };

        test('should transform version with correct props', () => {
            const result = transformVersionToProps(mockVersion as unknown as BoxItemVersion);
            expect(result.id).toBe('version-1');
            expect(result.versionNumber).toBe(5);
            expect(result.actionType).toBe('upload');
            expect(result.authorName).toBe('Uploader');
            expect(result.avatarUrl).toBeUndefined();
            expect(result.createdAt).toBe(new Date('2024-04-01T00:00:00Z').getTime());
        });

        test.each([
            ['created', 'upload'],
            ['trashed', 'delete'],
            ['restored', 'restore'],
            ['promoted', 'promote'],
            ['upload', 'upload'],
            ['delete', 'delete'],
        ])('should map action_type "%s" to "%s"', (input, expected) => {
            const version = { ...mockVersion, action_type: input };
            const result = transformVersionToProps(version as unknown as BoxItemVersion);
            expect(result.actionType).toBe(expected);
        });

        test('should use uploader_display_name when modified_by is missing', () => {
            const version = { ...mockVersion, modified_by: null, uploader_display_name: 'Display Name' };
            const result = transformVersionToProps(version as unknown as BoxItemVersion);
            expect(result.authorName).toBe('Display Name');
        });

        test('should use trashed_by when action is trashed and modified_by is null', () => {
            const version = {
                ...mockVersion,
                action_type: 'trashed',
                modified_by: null,
                trashed_by: { id: '400', name: 'Trasher', type: 'user' },
            };
            const result = transformVersionToProps(version as unknown as BoxItemVersion);
            expect(result.authorName).toBe('Trasher');
        });

        test('should prefer the action-specific user over modified_by for promotion', () => {
            const version = {
                ...mockVersion,
                action_type: 'promoted',
                modified_by: { id: '300', name: 'Uploader', type: 'user' },
                promoted_by: { id: '500', name: 'Promoter', type: 'user' },
                version_promoted: 'promoted',
            };
            const result = transformVersionToProps(version as unknown as BoxItemVersion);
            expect(result.authorName).toBe('Promoter');
            expect(result.actionType).toBe('promote');
        });

        test('should derive action from version flags when action_type is missing', () => {
            const trashedVersion = { ...mockVersion, action_type: undefined, trashed_at: '2024-04-02T00:00:00Z' };
            expect(transformVersionToProps(trashedVersion as unknown as BoxItemVersion).actionType).toBe('delete');

            const restoredVersion = { ...mockVersion, action_type: undefined, restored_at: '2024-04-02T00:00:00Z' };
            expect(transformVersionToProps(restoredVersion as unknown as BoxItemVersion).actionType).toBe('restore');

            const promotedVersion = { ...mockVersion, action_type: undefined, version_promoted: 'promoted' };
            expect(transformVersionToProps(promotedVersion as unknown as BoxItemVersion).actionType).toBe('promote');
        });

        test('should default to upload when action_type is unknown and no flags are set', () => {
            const version = { ...mockVersion, action_type: 'unrecognized' };
            const result = transformVersionToProps(version as unknown as BoxItemVersion);
            expect(result.actionType).toBe('upload');
        });

        test('should fall back to version_end when version_number is missing', () => {
            const version = { ...mockVersion, version_end: 7, version_number: undefined, version_start: 1 };
            const result = transformVersionToProps(version as unknown as BoxItemVersion);
            expect(result.versionNumber).toBe(7);
        });
    });

    describe('transformAppActivityToProps()', () => {
        const mockAppActivity = {
            activity_template: { id: 'tmpl-1', type: 'activity_template' },
            app: { icon_url: 'https://example.com/app-icon.png', id: 'app-1', name: 'Slack', type: 'app' },
            created_at: '2024-05-01T00:00:00Z',
            created_by: { id: '500', name: 'Bot User', type: 'user' },
            id: 'app-activity-1',
            permissions: { can_delete: false },
            rendered_text: 'Shared in <a href="#">#general</a>',
            type: 'app_activity',
        };

        test('should transform app activity with correct props', () => {
            const result = transformAppActivityToProps(mockAppActivity as unknown as AppActivityItem);
            expect(result.id).toBe('app-activity-1');
            expect(result.appIconUrl).toBe('https://example.com/app-icon.png');
            expect(result.appName).toBe('Slack');
            expect(result.createdAt).toBe(new Date('2024-05-01T00:00:00Z').getTime());
            expect(result.renderedText).toBe('Shared in <a href="#">#general</a>');
        });
    });

    describe('transformFeedItem()', () => {
        test('should return null for unknown item types', () => {
            const unknown = { type: 'unknown', id: 'x' };
            expect(transformFeedItem(unknown as unknown as FeedItem)).toBeNull();
        });

        test('should transform a comment feed item', () => {
            const comment = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'User', type: 'user' },
                id: 'c1',
                message: '',
                modified_at: '2024-01-01T00:00:00Z',
                permissions: {},
                status: 'open',
                tagged_message: 'Test',
                type: 'comment',
            };
            const result = transformFeedItem(comment as unknown as FeedItem);
            expect(result).not.toBeNull();
            expect(result!.type).toBe('comment');
            expect(result!.id).toBe('c1');
        });

        test('should transform an annotation feed item', () => {
            const annotation = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'User', type: 'user' },
                description: { message: 'Annotation' },
                file_version: { id: 'fv1', type: 'version', version_number: '1' },
                id: 'a1',
                modified_at: '2024-01-01T00:00:00Z',
                modified_by: { id: '1', name: 'User', type: 'user' },
                permissions: {},
                target: { location: { type: 'page', value: 1 }, type: 'point', x: 0, y: 0 },
                type: 'annotation',
            };
            const result = transformFeedItem(annotation as unknown as FeedItem);
            expect(result).not.toBeNull();
            expect(result!.type).toBe('annotation');
        });

        test('should transform a task feed item', () => {
            const task = {
                assigned_to: { entries: [], limit: 20, next_marker: null },
                completion_rule: 'ALL_ASSIGNEES',
                created_at: '2024-01-01T00:00:00Z',
                created_by: {
                    id: 'tc',
                    role: 'CREATOR',
                    status: 'NOT_STARTED',
                    target: { id: '1', name: 'User' },
                    type: 'task_collaborator',
                },
                description: 'Task',
                id: 't1',
                permissions: {
                    can_create_task_collaborator: false,
                    can_create_task_link: false,
                    can_delete: false,
                    can_update: false,
                },
                status: 'NOT_STARTED',
                task_links: { entries: [], limit: 20, next_marker: null },
                task_type: 'GENERAL',
                type: 'task',
            };
            const result = transformFeedItem(task as unknown as FeedItem);
            expect(result).not.toBeNull();
            expect(result!.type).toBe('task');
            expect((result as { originalTask: unknown }).originalTask).toBe(task);
        });

        test('should transform a version feed item', () => {
            const version = {
                action_type: 'created',
                created_at: '2024-01-01T00:00:00Z',
                id: 'v1',
                modified_by: { id: '1', name: 'User', type: 'user' },
                type: 'file_version',
                version_number: '3',
            };
            const result = transformFeedItem(version as unknown as FeedItem);
            expect(result).not.toBeNull();
            expect(result!.type).toBe('version');
        });

        test('should transform an app_activity feed item', () => {
            const appActivity = {
                activity_template: { id: 'tmpl-1', type: 'activity_template' },
                app: { icon_url: 'icon.png', id: 'app-1', name: 'App', type: 'app' },
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'User', type: 'user' },
                id: 'aa1',
                permissions: { can_delete: false },
                rendered_text: '<p>Activity</p>',
                type: 'app_activity',
            };
            const result = transformFeedItem(appActivity as unknown as FeedItem);
            expect(result).not.toBeNull();
            expect(result!.type).toBe('app_activity');
        });

        test('should set isResolved, resolvedBy, and resolvedAt for resolved comments from the resolution field', () => {
            const comment = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'Author', type: 'user' },
                id: 'c1',
                message: '',
                modified_at: '2024-01-02T00:00:00Z',
                modified_by: { id: '2', name: 'Editor', type: 'user' },
                permissions: {},
                resolution: {
                    resolved_at: '2024-01-03T00:00:00Z',
                    resolved_by: { id: '3', name: 'Resolver', type: 'user' },
                },
                status: 'resolved',
                tagged_message: 'Resolved comment',
                type: 'comment',
            };
            const result = transformFeedItem(comment as unknown as FeedItem);
            expect(result!.type).toBe('comment');
            if (result!.type === 'comment') {
                expect(result!.isResolved).toBe(true);
                expect(result!.resolvedBy).toBe('Resolver');
                expect(result!.resolvedAt).toBe(new Date('2024-01-03T00:00:00Z').getTime());
            }
        });

        test('should leave resolvedBy and resolvedAt undefined when a resolved comment has no resolution field', () => {
            const comment = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'User', type: 'user' },
                id: 'c1',
                message: '',
                modified_at: '2024-01-01T00:00:00Z',
                permissions: {},
                status: 'resolved',
                tagged_message: 'Resolved comment',
                type: 'comment',
            };
            const result = transformFeedItem(comment as unknown as FeedItem);
            expect(result!.type).toBe('comment');
            if (result!.type === 'comment') {
                expect(result!.isResolved).toBe(true);
                expect(result!.resolvedBy).toBeUndefined();
                expect(result!.resolvedAt).toBeUndefined();
            }
        });

        test('should set resolvedBy and resolvedAt for resolved annotations from the resolution field', () => {
            const annotation = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'Author', type: 'user' },
                description: { message: 'Annotation' },
                file_version: { id: 'fv1', type: 'version', version_number: '1' },
                id: 'a1',
                modified_at: '2024-01-02T00:00:00Z',
                modified_by: { id: '2', name: 'Editor', type: 'user' },
                permissions: {},
                resolution: {
                    resolved_at: '2024-01-03T00:00:00Z',
                    resolved_by: { id: '3', name: 'Resolver', type: 'user' },
                },
                status: 'resolved',
                target: { location: { type: 'page', value: 1 }, type: 'point', x: 0, y: 0 },
                type: 'annotation',
            };
            const result = transformFeedItem(annotation as unknown as FeedItem);
            expect(result!.type).toBe('annotation');
            if (result!.type === 'annotation') {
                expect(result!.isResolved).toBe(true);
                expect(result!.resolvedBy).toBe('Resolver');
                expect(result!.resolvedAt).toBe(new Date('2024-01-03T00:00:00Z').getTime());
            }
        });
    });

    describe('extractTimestampMarkup()', () => {
        test('should return text unchanged when no timestamp markup is present', () => {
            expect(extractTimestampMarkup('regular comment')).toEqual({ cleanText: 'regular comment' });
        });

        test('should return empty input unchanged', () => {
            expect(extractTimestampMarkup('')).toEqual({ cleanText: '' });
        });

        test('should extract timestamp markup with versionId and return a frame badge target', () => {
            const result = extractTimestampMarkup('#[timestamp:8055,versionId:2390295731268]  wowo');
            expect(result.cleanText).toBe('wowo');
            expect(result.target).toEqual({ timestamp: '0:08', type: 'frame' });
            expect(result.timestampMarkup).toBe('#[timestamp:8055,versionId:2390295731268]');
            expect(result.timestampMs).toBe(8055);
        });

        test('should extract timestamp markup without versionId', () => {
            const result = extractTimestampMarkup('#[timestamp:65000] hello');
            expect(result.cleanText).toBe('hello');
            expect(result.target).toEqual({ timestamp: '1:05', type: 'frame' });
            expect(result.timestampMarkup).toBe('#[timestamp:65000]');
            expect(result.timestampMs).toBe(65000);
        });

        test('should leave timestamp markup that does not anchor at the start of the message untouched', () => {
            const result = extractTimestampMarkup('see #[timestamp:8055,versionId:1] this');
            expect(result.cleanText).toBe('see #[timestamp:8055,versionId:1] this');
            expect(result.target).toBeUndefined();
        });

        test('should return empty cleanText when the message is only timestamp markup', () => {
            const result = extractTimestampMarkup('#[timestamp:8055,versionId:1]');
            expect(result.cleanText).toBe('');
            expect(result.target).toEqual({ timestamp: '0:08', type: 'frame' });
        });

        test('should leave malformed timestamp markup untouched', () => {
            const result = extractTimestampMarkup('#[timestamp:abc] hello');
            expect(result.cleanText).toBe('#[timestamp:abc] hello');
            expect(result.target).toBeUndefined();
        });

        test('should drop the badge when the timestamp value exceeds Number.MAX_SAFE_INTEGER', () => {
            const result = extractTimestampMarkup('#[timestamp:99999999999999999999] hello');
            expect(result.cleanText).toBe('hello');
            expect(result.target).toBeUndefined();
            expect(result.timestampMs).toBeUndefined();
        });
    });

    describe('transformCommentToMessages() with timestamp markup', () => {
        test('should strip #[timestamp:...] markup from rendered message text', () => {
            const comment = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'User', type: 'user' },
                id: 'c1',
                message: '#[timestamp:8055,versionId:2390295731268]  wowo',
                modified_at: '2024-01-01T00:00:00Z',
                permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: true },
                tagged_message: '',
                type: 'comment',
            };
            const messages = transformCommentToMessages(comment as unknown as Comment);
            expect(messages[0].message.content[0].content).toEqual([{ type: 'text', text: 'wowo' }]);
        });
    });

    describe('transformFeedItem() with enhanced_comment timestamp markup', () => {
        test('should populate annotationTarget with frame badge for a comment containing timestamp markup', () => {
            const comment = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'User', type: 'user' },
                id: 'c1',
                message: '#[timestamp:8055,versionId:2390295731268]  wowo',
                modified_at: '2024-01-01T00:00:00Z',
                permissions: {},
                status: 'open',
                tagged_message: '',
                type: 'comment',
            };
            const result = transformFeedItem(comment as unknown as FeedItem);
            expect(result!.type).toBe('comment');
            if (result!.type === 'comment') {
                expect(result.annotationTarget).toEqual({ timestamp: '0:08', type: 'frame' });
                expect(result.annotationTimestampMarkup).toBe('#[timestamp:8055,versionId:2390295731268]');
                expect(result.annotationTimestampMs).toBe(8055);
            }
        });

        test('should leave annotationTarget undefined for a regular comment without timestamp markup', () => {
            const comment = {
                created_at: '2024-01-01T00:00:00Z',
                created_by: { id: '1', name: 'User', type: 'user' },
                id: 'c1',
                message: 'regular comment',
                modified_at: '2024-01-01T00:00:00Z',
                permissions: {},
                status: 'open',
                tagged_message: '',
                type: 'comment',
            };
            const result = transformFeedItem(comment as unknown as FeedItem);
            if (result!.type === 'comment') {
                expect(result.annotationTarget).toBeUndefined();
                expect(result.annotationTimestampMarkup).toBeUndefined();
                expect(result.annotationTimestampMs).toBeUndefined();
            }
        });
    });

    describe('annotationTargetToBadge()', () => {
        test('should return undefined when target is missing', () => {
            expect(annotationTargetToBadge()).toBeUndefined();
        });

        test('should return undefined for an unknown target type', () => {
            const target = { location: { type: 'page', value: 1 }, type: 'unknown' };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toBeUndefined();
        });

        test('should map drawing target to a drawing badge with the page number', () => {
            const target = { location: { type: 'page', value: 1 }, type: 'drawing' };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                page: 1,
                type: 'drawing',
            });
        });

        test('should map highlight target to a highlight badge with the highlighted text and the page number', () => {
            const target = { location: { type: 'page', value: 4 }, text: 'selected excerpt', type: 'highlight' };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                highlightedText: 'selected excerpt',
                page: 4,
                type: 'highlight',
            });
        });

        test('should fall back to empty highlightedText when highlight target has no text', () => {
            const target = { location: { type: 'page', value: 4 }, type: 'highlight' };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                highlightedText: '',
                page: 4,
                type: 'highlight',
            });
        });

        test('should map point target to a point badge with the page number', () => {
            const target = { location: { type: 'page', value: 3 }, type: 'point', x: 0, y: 0 };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                page: 3,
                type: 'point',
            });
        });

        test('should map region target to a region badge with the page number', () => {
            const target = {
                location: { type: 'page', value: 2 },
                shape: { height: 10, type: 'rect', width: 20, x: 5, y: 5 },
                type: 'region',
            };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                page: 2,
                type: 'region',
            });
        });

        test('should default page to 0 when location is missing', () => {
            const target = { type: 'point', x: 0, y: 0 };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                page: 0,
                type: 'point',
            });
        });

        test('should map a sub-hour frame-location target to a frame badge with M:SS timestamp', () => {
            const target = {
                location: { type: 'frame', value: 4623 },
                shape: { height: 10, type: 'rect', width: 20, x: 5, y: 5 },
                type: 'region',
            };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                timestamp: '0:04',
                type: 'frame',
            });
        });

        test('should map an over-hour frame-location target to a frame badge with H:MM:SS timestamp', () => {
            const target = { location: { type: 'frame', value: 3661000 }, type: 'region' };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                timestamp: '1:01:01',
                type: 'frame',
            });
        });

        test('should default the frame timestamp to 0:00 when location.value is missing', () => {
            const target = { location: { type: 'frame' }, type: 'region' };
            expect(annotationTargetToBadge(target as unknown as Annotation['target'])).toEqual({
                timestamp: '0:00',
                type: 'frame',
            });
        });
    });

    describe('avatarUrls', () => {
        const commentWithoutAvatar = {
            created_at: '2024-01-01T00:00:00Z',
            created_by: { email: 'u@example.com', id: '42', name: 'No-Avatar User', type: 'user' },
            id: 'comment-x',
            message: 'hi',
            modified_at: '2024-01-01T00:00:00Z',
            permissions: { can_delete: false, can_edit: false, can_reply: false, can_resolve: false },
            tagged_message: 'hi',
            type: 'comment',
        };

        test('transformCommentToMessages resolves author avatar from the map', () => {
            const [message] = transformCommentToMessages(commentWithoutAvatar as unknown as Comment, {
                '42': 'fetched://avatar',
            });
            expect(message.author.avatarUrl).toBe('fetched://avatar');
        });

        test('transformCommentToMessages leaves avatar undefined when id not in map', () => {
            const [message] = transformCommentToMessages(commentWithoutAvatar as unknown as Comment, {
                '999': 'other://avatar',
            });
            expect(message.author.avatarUrl).toBeUndefined();
        });

        test('transformAnnotationToMessages resolves both root and reply authors from the map', () => {
            const annotation = {
                created_at: '2024-02-01T00:00:00Z',
                created_by: { id: '1', name: 'A', type: 'user' },
                description: { message: 'text' },
                id: 'a-1',
                modified_at: '2024-02-01T00:00:00Z',
                permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: true },
                replies: [
                    {
                        created_at: '2024-02-02T00:00:00Z',
                        created_by: { id: '2', name: 'B', type: 'user' },
                        id: 'r-1',
                        message: 'reply',
                        modified_at: '2024-02-02T00:00:00Z',
                        permissions: { can_delete: false, can_edit: false, can_reply: false, can_resolve: false },
                        tagged_message: 'reply',
                        type: 'comment',
                    },
                ],
                type: 'annotation',
            };
            const [root, reply] = transformAnnotationToMessages(annotation as unknown as Annotation, {
                '1': 'a://1',
                '2': 'a://2',
            });
            expect(root.author.avatarUrl).toBe('a://1');
            expect(reply.author.avatarUrl).toBe('a://2');
        });

        test('transformTaskToProps resolves author and assignee avatars from the map', () => {
            const task = {
                assigned_to: {
                    entries: [
                        {
                            id: 'tc-1',
                            permissions: { can_delete: false, can_update: true },
                            role: 'ASSIGNEE',
                            status: 'NOT_STARTED',
                            target: { id: '100', name: 'Assignee', type: 'user' },
                            type: 'task_collaborator',
                        },
                    ],
                    next_marker: null,
                },
                completion_rule: 'ANY_ASSIGNEE',
                created_at: '2024-03-01T00:00:00Z',
                created_by: {
                    id: 'tc-c',
                    role: 'CREATOR',
                    status: 'NOT_STARTED',
                    target: { id: '200', name: 'Creator', type: 'user' },
                    type: 'task_collaborator',
                },
                id: 'task-x',
                permissions: { can_delete: false, can_update: false },
                status: 'NOT_STARTED',
                task_type: 'GENERAL',
                type: 'task',
            };
            const result = transformTaskToProps(task as unknown as TaskNew, undefined, {
                '100': 'a://100',
                '200': 'a://200',
            });
            expect(result.author.avatarUrl).toBe('a://200');
            expect(result.assignees[0].avatarUrl).toBe('a://100');
        });

        test('transformVersionToProps resolves the actor avatar from the map', () => {
            const version = {
                action_type: 'created',
                created_at: '2024-04-01T00:00:00Z',
                id: 'v-1',
                modified_by: { id: '300', name: 'Uploader', type: 'user' },
                type: 'file_version',
                version_number: '1',
            };
            const result = transformVersionToProps(version as unknown as BoxItemVersion, { '300': 'a://300' });
            expect(result.avatarUrl).toBe('a://300');
        });
    });
});
