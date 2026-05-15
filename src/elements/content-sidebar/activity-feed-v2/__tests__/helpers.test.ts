import { serializeMentionMarkup } from '@box/threaded-annotations';

import { dispatchReplyEdit, findMessagePermissions, logEditError, serializeEditorContent } from '../helpers';

import type { TransformedCommentItem } from '../types';

jest.mock('@box/threaded-annotations', () => ({
    serializeMentionMarkup: jest.fn(),
}));

const mockedSerialize = jest.mocked(serializeMentionMarkup);

const messages: TransformedCommentItem['messages'] = [
    {
        author: { email: 'u@b.com', id: 1, name: 'User' },
        createdAt: 0,
        id: 'root',
        message: { type: 'doc', content: [] },
        permissions: { canDelete: true, canEdit: true, canReply: true, canResolve: true },
    },
    {
        author: { email: 'u@b.com', id: 1, name: 'User' },
        createdAt: 0,
        id: 'reply-1',
        message: { type: 'doc', content: [] },
        permissions: { canDelete: true, canEdit: true, canReply: false, canResolve: false },
    },
];

describe('elements/content-sidebar/activity-feed-v2/helpers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('serializeEditorContent()', () => {
        beforeEach(() => {
            mockedSerialize.mockReturnValue({ hasMention: false, text: 'serialized-text' });
        });

        test('should return the serialized result on success', () => {
            const content = { type: 'doc', content: [] };
            expect(serializeEditorContent(content)).toEqual({ hasMention: false, text: 'serialized-text' });
            expect(mockedSerialize).toHaveBeenCalledWith(content);
        });

        test('should log via console.error and return null when serialize throws', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
            mockedSerialize.mockImplementation(() => {
                throw new Error('bad content');
            });

            expect(serializeEditorContent({})).toBeNull();
            expect(consoleError).toHaveBeenCalledWith(
                'ActivityFeedV2: failed to serialize editor content',
                expect.any(Error),
            );
            consoleError.mockRestore();
        });
    });

    describe('findMessagePermissions()', () => {
        test('should convert camelCase permissions to snake_case for the matched message', () => {
            expect(findMessagePermissions(messages, 'reply-1')).toEqual({
                can_delete: true,
                can_edit: true,
                can_reply: false,
                can_resolve: false,
            });
        });

        test('should return undefined when the id is not in the message list', () => {
            expect(findMessagePermissions(messages, 'unknown')).toBeUndefined();
        });
    });

    describe('logEditError()', () => {
        test('should log via console.error and return undefined so the vendor shows its default message', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
            const error = new Error('save failed');

            expect(logEditError(error)).toBeUndefined();
            expect(consoleError).toHaveBeenCalledWith('ActivityFeedV2: failed to save edit', error);
            consoleError.mockRestore();
        });
    });

    describe('dispatchReplyEdit()', () => {
        test('should call onReplyUpdate with parentId and snake_case reply permissions', () => {
            const onReplyUpdate = jest.fn();
            dispatchReplyEdit({ id: 'reply-1', messages, onReplyUpdate, parentId: 'root', text: 'edited' });

            expect(onReplyUpdate).toHaveBeenCalledWith({
                id: 'reply-1',
                parentId: 'root',
                permissions: { can_delete: true, can_edit: true, can_reply: false, can_resolve: false },
                text: 'edited',
            });
        });

        test('should log and skip the dispatch when reply permissions cannot be resolved', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
            const onReplyUpdate = jest.fn();

            dispatchReplyEdit({ id: 'orphan-id', messages, onReplyUpdate, parentId: 'root', text: 'edited' });

            expect(onReplyUpdate).not.toHaveBeenCalled();
            expect(consoleError).toHaveBeenCalledWith(
                'ActivityFeedV2: no permissions found for reply "orphan-id" in thread "root"',
            );
            consoleError.mockRestore();
        });

        test('should not throw when onReplyUpdate is not provided', () => {
            expect(() =>
                dispatchReplyEdit({ id: 'reply-1', messages, parentId: 'root', text: 'edited' }),
            ).not.toThrow();
        });
    });
});
