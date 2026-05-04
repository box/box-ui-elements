import type { Annotation } from '../../../../common/types/annotations';
import type { AppActivityItem, Comment, FeedItem } from '../../../../common/types/feed';
import type { BoxItemVersion } from '../../../../common/types/core';
import type { TaskNew } from '../../../../common/types/tasks';

import {
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
            const result = textToDocumentNode('Hello world');
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
            const result = textToDocumentNode('Line 1\nLine 2\nLine 3');
            expect(result.content).toHaveLength(3);
            expect(result.content[0].content).toEqual([{ type: 'text', text: 'Line 1' }]);
            expect(result.content[1].content).toEqual([{ type: 'text', text: 'Line 2' }]);
            expect(result.content[2].content).toEqual([{ type: 'text', text: 'Line 3' }]);
        });

        test('should handle empty lines as paragraphs without content key', () => {
            const result = textToDocumentNode('Before\n\nAfter');
            expect(result.content).toHaveLength(3);
            expect(result.content[1]).toEqual({ type: 'paragraph' });
        });

        test('should handle empty string', () => {
            const result = textToDocumentNode('');
            expect(result).toEqual({ type: 'doc', content: [] });
        });

        test('should parse @[id:name] mentions into mention nodes', () => {
            const result = textToDocumentNode('Hello @[123:Jane Doe] how are you?');
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
            const result = textToDocumentNode('@[1:Alice] and @[2:Bob]');
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
            const result = textToDocumentNode('Hi @[1:Alice]\nBye @[2:Bob]');
            expect(result.content).toHaveLength(2);
            expect(result.content[0].content[1].type).toBe('mention');
            expect(result.content[1].content[1].type).toBe('mention');
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

        test('should use tagged_message over message and parse mentions', () => {
            const messages = transformCommentToMessages(mockComment as unknown as Comment);
            expect(messages[0].message.content[0].content).toEqual([
                { type: 'text', text: 'Hello ' },
                {
                    type: 'mention',
                    attrs: { authorId: '', mentionId: '456', mentionedUserId: '456', mentionedUserName: 'Jane' },
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
                avatarUrl: 'https://example.com/assignee.png',
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
                avatarUrl: 'https://example.com/creator.png',
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
            expect(result.avatarUrl).toBe('https://example.com/uploader.png');
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

        test('should set isResolved true for resolved comments', () => {
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
            }
        });
    });
});
