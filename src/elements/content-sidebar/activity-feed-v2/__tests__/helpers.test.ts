import { serializeMentionMarkup, serializeMessageToMarkdown } from '@box/threaded-annotations';

import {
    dispatchReplyDelete,
    dispatchReplyEdit,
    feedItemMatchesEntryId,
    findMessagePermissions,
    logEditError,
    resolveFeedItemIdForEntry,
    serializeEditorContent,
} from '../helpers';

import type { TransformedAnnotationItem, TransformedCommentItem, TransformedFeedItem } from '../types';

jest.mock('@box/threaded-annotations', () => ({
    serializeMentionMarkup: jest.fn(),
    serializeMessageToMarkdown: jest.fn(),
}));

const mockedSerialize = jest.mocked(serializeMentionMarkup);
const mockedSerializeMessageToMarkdown = jest.mocked(serializeMessageToMarkdown);

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
            expect(mockedSerializeMessageToMarkdown).not.toHaveBeenCalled();
        });

        test('should use serializeMessageToMarkdown for text when isRichTextEnabled is true', () => {
            const content = { type: 'doc', content: [] };
            mockedSerialize.mockReturnValue({ hasMention: true, text: 'plain-markup' });
            mockedSerializeMessageToMarkdown.mockReturnValue('**bold**');

            expect(serializeEditorContent(content, true)).toEqual({ hasMention: true, text: '**bold**' });
            expect(mockedSerializeMessageToMarkdown).toHaveBeenCalledWith(content);
            expect(mockedSerialize).toHaveBeenCalledWith(content);
        });

        test('should trim markdown from serializeMessageToMarkdown', () => {
            mockedSerializeMessageToMarkdown.mockReturnValue('  \n# heading\n  ');

            expect(serializeEditorContent({}, true)).toEqual({ hasMention: false, text: '# heading' });
        });

        test('should log via console.error and return null when serializeMessageToMarkdown throws', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
            mockedSerializeMessageToMarkdown.mockImplementation(() => {
                throw new Error('bad markdown');
            });

            expect(serializeEditorContent({}, true)).toBeNull();
            expect(consoleError).toHaveBeenCalledWith(
                'ActivityFeedV2: failed to serialize editor content',
                expect.any(Error),
            );
            consoleError.mockRestore();
        });

        test.each`
            input                       | expected
            ${'   hello   '}            | ${'hello'}
            ${'\n\nhello world\n\n'}    | ${'hello world'}
            ${'\thello\t'}              | ${'hello'}
            ${'  \t\nhello\n '}         | ${'hello'}
            ${'   leading and inner  '} | ${'leading and inner'}
        `('should trim leading and trailing whitespace from "$input"', ({ input, expected }) => {
            mockedSerialize.mockReturnValue({ hasMention: true, text: input });

            expect(serializeEditorContent({})).toEqual({ hasMention: true, text: expected });
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

    describe('dispatchReplyDelete()', () => {
        test('should call onReplyDelete with parentId and snake_case reply permissions', () => {
            const onReplyDelete = jest.fn();
            dispatchReplyDelete({ id: 'reply-1', messages, onReplyDelete, parentId: 'root' });

            expect(onReplyDelete).toHaveBeenCalledWith({
                id: 'reply-1',
                parentId: 'root',
                permissions: { can_delete: true, can_edit: true, can_reply: false, can_resolve: false },
            });
        });

        test('should log and skip the dispatch when reply permissions cannot be resolved', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
            const onReplyDelete = jest.fn();

            dispatchReplyDelete({ id: 'orphan-id', messages, onReplyDelete, parentId: 'root' });

            expect(onReplyDelete).not.toHaveBeenCalled();
            expect(consoleError).toHaveBeenCalledWith(
                'ActivityFeedV2: no permissions found for reply "orphan-id" in thread "root"',
            );
            consoleError.mockRestore();
        });

        test('should not throw when onReplyDelete is not provided', () => {
            expect(() => dispatchReplyDelete({ id: 'reply-1', messages, parentId: 'root' })).not.toThrow();
        });
    });

    describe('feedItemMatchesEntryId()', () => {
        // Partial fixtures — helpers only read id / type / messages.
        const commentItem = {
            id: 'comment-1',
            isResolved: false,
            messages,
            originalText: 'Parent comment',
            permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: true },
            type: 'comment',
        } as TransformedCommentItem;

        const annotationItem = {
            id: 'annotation-1',
            isResolved: false,
            messages: [
                { ...messages[0], id: 'annotation-1' },
                { ...messages[1], id: 'annotation-reply-1' },
            ],
            permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: true },
            type: 'annotation',
        } as TransformedAnnotationItem;

        test.each`
            item              | feedEntryId             | expected
            ${commentItem}    | ${'comment-1'}          | ${true}
            ${commentItem}    | ${'reply-1'}            | ${true}
            ${commentItem}    | ${'other'}              | ${false}
            ${annotationItem} | ${'annotation-1'}       | ${true}
            ${annotationItem} | ${'annotation-reply-1'} | ${true}
            ${annotationItem} | ${'other'}              | ${false}
        `('should return $expected when matching $feedEntryId on $item.type', ({ item, feedEntryId, expected }) => {
            expect(feedItemMatchesEntryId(item, feedEntryId)).toBe(expected);
        });

        test('should match non-thread items only by root id', () => {
            const versionItem = { id: 'version-1', props: {}, type: 'version' } as TransformedFeedItem;
            expect(feedItemMatchesEntryId(versionItem, 'version-1')).toBe(true);
            expect(feedItemMatchesEntryId(versionItem, 'other')).toBe(false);
        });
    });

    describe('resolveFeedItemIdForEntry()', () => {
        const items = [
            {
                id: 'comment-1',
                isResolved: false,
                messages,
                originalText: 'Parent comment',
                permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: true },
                type: 'comment',
            },
            {
                id: 'annotation-1',
                isResolved: false,
                messages: [
                    { ...messages[0], id: 'annotation-1' },
                    { ...messages[1], id: 'annotation-reply-1' },
                ],
                permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: true },
                type: 'annotation',
            },
        ] as TransformedFeedItem[];

        test.each`
            feedEntryId             | expected
            ${'comment-1'}          | ${'comment-1'}
            ${'reply-1'}            | ${'comment-1'}
            ${'annotation-1'}       | ${'annotation-1'}
            ${'annotation-reply-1'} | ${'annotation-1'}
            ${'missing'}            | ${undefined}
        `('should resolve $feedEntryId to $expected', ({ feedEntryId, expected }) => {
            expect(resolveFeedItemIdForEntry(items, feedEntryId)).toBe(expected);
        });
    });
});
