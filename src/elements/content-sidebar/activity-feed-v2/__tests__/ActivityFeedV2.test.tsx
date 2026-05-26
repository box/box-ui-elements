import * as React from 'react';

import { ActivityFeed } from '@box/activity-feed';

import { act, render, screen } from '../../../../test-utils/testing-library';
import ActivityFeedV2 from '..';
import type { ActivityFeedV2Props } from '../ActivityFeedV2';

type EditorProps = React.ComponentProps<typeof ActivityFeed.Editor>;

const mockSerializeMentionMarkup = jest.fn((doc: unknown) => ({ hasMention: false, text: JSON.stringify(doc) }));

jest.mock('@box/threaded-annotations', () => ({
    AnnotationBadgeType: {
        Drawing: 'drawing',
        Frame: 'frame',
        Highlight: 'highlight',
        Point: 'point',
        Region: 'region',
    },
    serializeMentionMarkup: (doc: unknown) => mockSerializeMentionMarkup(doc),
}));

const mockScrollTo = jest.fn<boolean, [string]>(() => true);

type FilterOptionProps = { checked?: boolean; onCheckedChange?: (checked: boolean) => void };
let lastShowResolvedOptionProps: FilterOptionProps = {};
let lastMentionMeOptionProps: FilterOptionProps = {};
let lastEditorProps: Partial<EditorProps> = {};

jest.mock('@box/activity-feed', () => {
    const actual = jest.requireActual('@box/activity-feed');
    const ActivityFeedRoot = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="activity-feed-root">{children}</div>
    );
    const ActivityFeedList = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="activity-feed-list">{children}</div>
    );
    ActivityFeedList.AppActivity = (props: { id: string }) => (
        <div data-testid={`app-activity-${props.id}`}>AppActivity</div>
    );
    ActivityFeedList.Task = (props: { id: string }) => <div data-testid={`task-${props.id}`}>Task</div>;
    ActivityFeedList.ThreadedAnnotation = (props: { messages?: Array<{ id: string }> }) => (
        <div data-testid={`threaded-annotation-${props.messages?.[0]?.id}`}>ThreadedAnnotation</div>
    );
    ActivityFeedList.Version = (props: { id: string }) => <div data-testid={`version-${props.id}`}>Version</div>;
    const ActivityFeedEditor = (props: Partial<EditorProps>) => {
        lastEditorProps = props;
        return <div data-testid="activity-feed-editor">Editor</div>;
    };
    const ActivityFeedHeader = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="activity-feed-header">{children}</div>
    );
    ActivityFeedHeader.Actions = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
    ActivityFeedHeader.FilterMenu = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
    ActivityFeedHeader.ShowResolvedOption = (props: FilterOptionProps) => {
        lastShowResolvedOptionProps = props;
        return <div data-testid="show-resolved-option">{String(props.checked)}</div>;
    };
    ActivityFeedHeader.MentionMeOption = (props: FilterOptionProps) => {
        lastMentionMeOptionProps = props;
        return <div data-testid="mention-me-option">{String(props.checked)}</div>;
    };
    ActivityFeedHeader.TaskButton = () => <div data-testid="task-button" />;

    return {
        ...actual,
        ActivityFeed: {
            Editor: ActivityFeedEditor,
            Header: ActivityFeedHeader,
            List: ActivityFeedList,
            Root: ActivityFeedRoot,
        },
        useActivityFeedScroll: () => ({ scrollTo: mockScrollTo }),
    };
});

const mockCurrentUser: ActivityFeedV2Props['currentUser'] = {
    id: 'user-1',
    name: 'Current User',
    type: 'user',
};

const mockComment = {
    created_at: '2024-01-01T00:00:00Z',
    created_by: { id: '2', name: 'Commenter', type: 'user' },
    id: 'comment-1',
    message: '',
    modified_at: '2024-01-01T00:00:00Z',
    permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: false },
    tagged_message: 'Hello world',
    type: 'comment',
};

const mockAnnotation = {
    created_at: '2024-02-01T00:00:00Z',
    created_by: { id: '3', name: 'Annotator', type: 'user' },
    description: { message: 'Annotation text' },
    file_version: { id: 'fv-1', type: 'version', version_number: '1' },
    id: 'annotation-1',
    modified_at: '2024-02-01T00:00:00Z',
    modified_by: { id: '3', name: 'Annotator', type: 'user' },
    permissions: { can_delete: true, can_edit: true, can_reply: true, can_resolve: true },
    target: { location: { type: 'page', value: 1 }, type: 'point', x: 0, y: 0 },
    type: 'annotation',
};

const mockTask = {
    assigned_to: { entries: [], limit: 20, next_marker: null },
    completion_rule: 'ALL_ASSIGNEES',
    created_at: '2024-03-01T00:00:00Z',
    created_by: {
        id: 'tc',
        role: 'CREATOR',
        status: 'NOT_STARTED',
        target: { id: 'user-1', name: 'Current User' },
        type: 'task_collaborator',
    },
    description: 'Review document',
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
};

const mockVersion = {
    action_type: 'created',
    created_at: '2024-04-01T00:00:00Z',
    id: 'version-1',
    modified_by: { id: '4', name: 'Uploader', type: 'user' },
    type: 'file_version',
    version_number: '3',
};

const mockAppActivity = {
    activity_template: { id: 'tmpl-1', type: 'activity_template' },
    app: { icon_url: 'icon.png', id: 'app-1', name: 'Slack', type: 'app' },
    created_at: '2024-05-01T00:00:00Z',
    created_by: { id: '5', name: 'Bot', type: 'user' },
    id: 'app-activity-1',
    permissions: { can_delete: false },
    rendered_text: 'Shared in #general',
    type: 'app_activity',
};

const feedItems = [
    mockComment,
    mockAnnotation,
    mockTask,
    mockVersion,
    mockAppActivity,
] as ActivityFeedV2Props['feedItems'];

describe('elements/content-sidebar/activity-feed-v2/ActivityFeedV2', () => {
    beforeEach(() => {
        mockScrollTo.mockReturnValue(true);
        lastShowResolvedOptionProps = {};
        lastMentionMeOptionProps = {};
        lastEditorProps = {};
        mockSerializeMentionMarkup.mockImplementation((doc: unknown) => ({
            hasMention: false,
            text: JSON.stringify(doc),
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render the ActivityFeed root, list, and editor when feedItems is provided', () => {
        render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);

        expect(screen.getByTestId('activity-feed-root')).toBeVisible();
        expect(screen.getByTestId('activity-feed-list')).toBeVisible();
        expect(screen.getByTestId('activity-feed-editor')).toBeVisible();
    });

    test('should not render the list when feedItems is undefined', () => {
        render(<ActivityFeedV2 currentUser={mockCurrentUser} />);
        expect(screen.queryByTestId('activity-feed-list')).not.toBeInTheDocument();
    });

    test('should render comment feed items as ThreadedAnnotation', () => {
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[mockComment] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('threaded-annotation-comment-1')).toBeVisible();
    });

    test('should render annotation feed items as ThreadedAnnotation', () => {
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[mockAnnotation] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('threaded-annotation-annotation-1')).toBeVisible();
    });

    test('should render task feed items', () => {
        render(
            <ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[mockTask] as ActivityFeedV2Props['feedItems']} />,
        );

        expect(screen.getByTestId('task-task-1')).toBeVisible();
    });

    test('should render version feed items', () => {
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[mockVersion] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('version-version-1')).toBeVisible();
    });

    test('should render app activity feed items', () => {
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[mockAppActivity] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('app-activity-app-activity-1')).toBeVisible();
    });

    test('should render all feed item types together', () => {
        render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={feedItems} />);

        expect(screen.getByTestId('threaded-annotation-comment-1')).toBeVisible();
        expect(screen.getByTestId('threaded-annotation-annotation-1')).toBeVisible();
        expect(screen.getByTestId('task-task-1')).toBeVisible();
        expect(screen.getByTestId('version-version-1')).toBeVisible();
        expect(screen.getByTestId('app-activity-app-activity-1')).toBeVisible();
    });

    test('should skip unknown feed item types', () => {
        const unknownItem = { type: 'unknown', id: 'unknown-1' };
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[unknownItem, mockComment] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('threaded-annotation-comment-1')).toBeVisible();
        expect(screen.getByTestId('activity-feed-list').children).toHaveLength(1);
    });

    test('should hide resolved comments by default (showResolved is false)', () => {
        const resolvedComment = {
            ...mockComment,
            id: 'resolved-1',
            status: 'resolved',
        };
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[mockComment, resolvedComment] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('threaded-annotation-comment-1')).toBeVisible();
        expect(screen.queryByTestId('threaded-annotation-resolved-1')).not.toBeInTheDocument();
    });

    test('should hide resolved annotations by default', () => {
        const resolvedAnnotation = {
            ...mockAnnotation,
            id: 'resolved-ann-1',
            status: 'resolved',
        };
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[mockAnnotation, resolvedAnnotation] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('threaded-annotation-annotation-1')).toBeVisible();
        expect(screen.queryByTestId('threaded-annotation-resolved-ann-1')).not.toBeInTheDocument();
    });

    test('should always show tasks, versions, and app activities regardless of filter state', () => {
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[mockTask, mockVersion, mockAppActivity] as ActivityFeedV2Props['feedItems']}
            />,
        );

        expect(screen.getByTestId('task-task-1')).toBeVisible();
        expect(screen.getByTestId('version-version-1')).toBeVisible();
        expect(screen.getByTestId('app-activity-app-activity-1')).toBeVisible();
    });

    test('should not render TaskButton when hasTasks is false', () => {
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[] as ActivityFeedV2Props['feedItems']}
                hasTasks={false}
            />,
        );

        expect(screen.getByTestId('activity-feed-root')).toBeVisible();
    });

    test('should return empty array from fetchUsers when getMentionAsync is not provided', async () => {
        render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);
        expect(screen.getByTestId('activity-feed-root')).toBeVisible();
    });

    test('should return empty array from fetchUsers when getMentionAsync rejects', async () => {
        const getMentionAsync = jest.fn().mockRejectedValue(new Error('API error'));
        render(
            <ActivityFeedV2
                currentUser={mockCurrentUser}
                feedItems={[] as ActivityFeedV2Props['feedItems']}
                getMentionAsync={getMentionAsync}
            />,
        );
        expect(screen.getByTestId('activity-feed-root')).toBeVisible();
    });

    describe('mention popover behavior', () => {
        test('should pass allowEmptyQuery=true so the popover opens on @ before any character is typed', () => {
            render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);

            expect(lastEditorProps.userSelectorProps?.allowEmptyQuery).toBe(true);
        });

        test('should skip the API call when fetchUsers is invoked with an empty query', async () => {
            const getMentionAsync = jest.fn().mockResolvedValue([{ id: '1', name: 'foo' }]);
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    getMentionAsync={getMentionAsync}
                />,
            );

            const result = await lastEditorProps.userSelectorProps?.fetchUsers?.('');

            expect(getMentionAsync).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        test('should skip the API call when fetchUsers is invoked with a whitespace-only query', async () => {
            const getMentionAsync = jest.fn().mockResolvedValue([{ id: '1', name: 'foo' }]);
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    getMentionAsync={getMentionAsync}
                />,
            );

            const result = await lastEditorProps.userSelectorProps?.fetchUsers?.('   ');

            expect(getMentionAsync).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        test('should call getMentionAsync with the trimmed value and shape results for a non-empty query', async () => {
            const getMentionAsync = jest.fn().mockResolvedValue([
                { email: 'a@b.com', id: '7', name: 'Alice' },
                { id: '8', login: 'bob@b.com', name: 'Bob' },
            ]);
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    getMentionAsync={getMentionAsync}
                />,
            );

            const result = await lastEditorProps.userSelectorProps?.fetchUsers?.('  al  ');

            expect(getMentionAsync).toHaveBeenCalledWith('al');
            expect(result).toEqual([
                { email: 'a@b.com', id: 7, name: 'Alice', value: '7' },
                { email: 'bob@b.com', id: 8, name: 'Bob', value: '8' },
            ]);
        });

        test('should render the V1-style start prompt via renderEmpty when value is empty', () => {
            render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);

            const empty = lastEditorProps.userSelectorProps?.renderEmpty?.('');
            render(<>{empty}</>);

            expect(screen.getByText('Mention someone to notify them')).toBeVisible();
        });

        test('should render the V1-style start prompt via renderEmpty when value is whitespace-only', () => {
            render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);

            const empty = lastEditorProps.userSelectorProps?.renderEmpty?.('   ');
            render(<>{empty}</>);

            expect(screen.getByText('Mention someone to notify them')).toBeVisible();
        });

        test('should render the no-users-found message via renderEmpty when value is non-empty', () => {
            render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);

            const empty = lastEditorProps.userSelectorProps?.renderEmpty?.('xyz');
            render(<>{empty}</>);

            expect(screen.getByText('No users found')).toBeVisible();
        });
    });

    describe('comment posting', () => {
        test('should call onCommentCreate with trimmed text when the editor posts content', async () => {
            mockSerializeMentionMarkup.mockReturnValue({ hasMention: true, text: '   hello world   ' });
            const onCommentCreate = jest.fn();
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );

            await lastEditorProps.onPost?.({ type: 'doc', content: [] });

            expect(onCommentCreate).toHaveBeenCalledWith('hello world', true);
        });

        test('should skip onCommentCreate when the trimmed text is empty', async () => {
            mockSerializeMentionMarkup.mockReturnValue({ hasMention: false, text: '   \n\t   ' });
            const onCommentCreate = jest.fn();
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );

            await lastEditorProps.onPost?.({ type: 'doc', content: [] });

            expect(onCommentCreate).not.toHaveBeenCalled();
        });
    });

    describe('filter controls', () => {
        test('should default showResolved and showOnlyMentionsMe to false in the filter menu', () => {
            render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);
            expect(lastShowResolvedOptionProps.checked).toBe(false);
            expect(lastMentionMeOptionProps.checked).toBe(false);
        });

        test('should reflect the controlled showResolved prop in the filter menu', () => {
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    showResolved
                />,
            );
            expect(lastShowResolvedOptionProps.checked).toBe(true);
        });

        test('should reflect the controlled showOnlyMentionsMe prop in the filter menu', () => {
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    showOnlyMentionsMe
                />,
            );
            expect(lastMentionMeOptionProps.checked).toBe(true);
        });

        test('should call onShowResolvedChange when the consumer toggles it', () => {
            const onShowResolvedChange = jest.fn();
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    onShowResolvedChange={onShowResolvedChange}
                    showResolved={false}
                />,
            );

            act(() => lastShowResolvedOptionProps.onCheckedChange?.(true));

            expect(onShowResolvedChange).toHaveBeenCalledWith(true);
            expect(onShowResolvedChange).toHaveBeenCalledTimes(1);
        });

        test('should call onShowOnlyMentionsMeChange when the consumer toggles it', () => {
            const onShowOnlyMentionsMeChange = jest.fn();
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                    onShowOnlyMentionsMeChange={onShowOnlyMentionsMeChange}
                    showOnlyMentionsMe={false}
                />,
            );

            act(() => lastMentionMeOptionProps.onCheckedChange?.(true));

            expect(onShowOnlyMentionsMeChange).toHaveBeenCalledWith(true);
            expect(onShowOnlyMentionsMeChange).toHaveBeenCalledTimes(1);
        });

        test('should manage filter state internally when no controlled props are provided', () => {
            const resolvedComment = { ...mockComment, id: 'resolved-1', status: 'resolved' };
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, resolvedComment] as ActivityFeedV2Props['feedItems']}
                />,
            );
            expect(screen.queryByTestId('threaded-annotation-resolved-1')).not.toBeInTheDocument();

            act(() => lastShowResolvedOptionProps.onCheckedChange?.(true));

            expect(screen.getByTestId('threaded-annotation-resolved-1')).toBeVisible();
        });

        test('should not update internal state when a controlled prop is provided', () => {
            const resolvedComment = { ...mockComment, id: 'resolved-1', status: 'resolved' };
            const onShowResolvedChange = jest.fn();
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, resolvedComment] as ActivityFeedV2Props['feedItems']}
                    onShowResolvedChange={onShowResolvedChange}
                    showResolved={false}
                />,
            );
            expect(screen.queryByTestId('threaded-annotation-resolved-1')).not.toBeInTheDocument();

            act(() => lastShowResolvedOptionProps.onCheckedChange?.(true));

            expect(onShowResolvedChange).toHaveBeenCalledWith(true);
            expect(screen.queryByTestId('threaded-annotation-resolved-1')).not.toBeInTheDocument();
        });

        test('should update internal state and notify the consumer when only a change handler is provided', () => {
            const resolvedComment = { ...mockComment, id: 'resolved-1', status: 'resolved' };
            const onShowResolvedChange = jest.fn();
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, resolvedComment] as ActivityFeedV2Props['feedItems']}
                    onShowResolvedChange={onShowResolvedChange}
                />,
            );
            expect(screen.queryByTestId('threaded-annotation-resolved-1')).not.toBeInTheDocument();

            act(() => lastShowResolvedOptionProps.onCheckedChange?.(true));

            expect(onShowResolvedChange).toHaveBeenCalledWith(true);
            expect(screen.getByTestId('threaded-annotation-resolved-1')).toBeVisible();
        });
    });

    describe('scroll to end on mount', () => {
        test('should scroll to the last rendered items id when the tab opens', () => {
            render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={feedItems} />);
            expect(mockScrollTo).toHaveBeenCalledWith('app-activity-1');
        });

        test('should not scroll when activeFeedEntryId is set (deep link takes precedence)', () => {
            render(
                <ActivityFeedV2 activeFeedEntryId="comment-1" currentUser={mockCurrentUser} feedItems={feedItems} />,
            );
            expect(mockScrollTo).toHaveBeenCalledWith('comment-1');
            expect(mockScrollTo).not.toHaveBeenCalledWith('app-activity-1');
        });

        test('should retry scroll-to-entry on later renders when first attempt returns false', () => {
            mockScrollTo.mockReturnValueOnce(false).mockReturnValue(true);
            const { rerender } = render(
                <ActivityFeedV2
                    activeFeedEntryId="annotation-1"
                    currentUser={mockCurrentUser}
                    feedItems={[] as ActivityFeedV2Props['feedItems']}
                />,
            );
            expect(mockScrollTo).toHaveBeenCalledWith('annotation-1');
            expect(mockScrollTo).toHaveBeenCalledTimes(1);

            rerender(
                <ActivityFeedV2 activeFeedEntryId="annotation-1" currentUser={mockCurrentUser} feedItems={feedItems} />,
            );
            expect(mockScrollTo).toHaveBeenCalledTimes(2);
            expect(mockScrollTo).toHaveBeenLastCalledWith('annotation-1');
        });

        test('should not re-scroll to scroll-to-entry target after success', () => {
            const { rerender } = render(
                <ActivityFeedV2 activeFeedEntryId="annotation-1" currentUser={mockCurrentUser} feedItems={feedItems} />,
            );
            expect(mockScrollTo).toHaveBeenCalledTimes(1);

            rerender(
                <ActivityFeedV2
                    activeFeedEntryId="annotation-1"
                    currentUser={mockCurrentUser}
                    feedItems={[...feedItems!]}
                />,
            );
            expect(mockScrollTo).toHaveBeenCalledTimes(1);
        });

        test('should not scroll when feedItems is empty', () => {
            render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[] as ActivityFeedV2Props['feedItems']} />);
            expect(mockScrollTo).not.toHaveBeenCalled();
        });

        test('should scroll to the last visible row after filters remove the tail', () => {
            const trailingAppActivity = { ...mockAppActivity, id: 'app-activity-2' };
            const resolvedCommentAfterTail = { ...mockComment, id: 'resolved-last', status: 'resolved' };
            render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={
                        [mockComment, trailingAppActivity, resolvedCommentAfterTail] as ActivityFeedV2Props['feedItems']
                    }
                />,
            );
            expect(mockScrollTo).toHaveBeenLastCalledWith('app-activity-2');
        });

        test('should retry scroll-to-end on later renders when first attempt returns false', () => {
            mockScrollTo.mockReturnValueOnce(false).mockReturnValue(true);
            const { rerender } = render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={feedItems} />);
            expect(mockScrollTo).toHaveBeenCalledTimes(1);
            rerender(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[...feedItems!]} />);
            expect(mockScrollTo).toHaveBeenCalledTimes(2);
        });

        test('should not re-scroll to the end after a successful scroll when filters change', () => {
            const { rerender } = render(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={feedItems} />);
            expect(mockScrollTo).toHaveBeenCalledTimes(1);
            rerender(<ActivityFeedV2 currentUser={mockCurrentUser} feedItems={[mockComment]} />);
            expect(mockScrollTo).toHaveBeenCalledTimes(1);
        });
    });

    describe('scroll to user post', () => {
        const newComment = { ...mockComment, id: 'new-comment', tagged_message: 'fresh post' };
        const strangerComment = { ...mockComment, id: 'stranger-comment', tagged_message: 'unrelated' };

        test('should scroll to the new item once feedItems updates after a post', async () => {
            const onCommentCreate = jest.fn();
            const { rerender } = render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );
            mockScrollTo.mockClear();

            await lastEditorProps.onPost?.({ type: 'doc', content: [] });
            expect(onCommentCreate).toHaveBeenCalled();
            expect(mockScrollTo).not.toHaveBeenCalled();

            rerender(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, newComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );

            expect(mockScrollTo).toHaveBeenLastCalledWith('new-comment');
        });

        test('should not scroll when onCommentCreate rejects (post failed)', async () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
            const onCommentCreate = jest.fn().mockRejectedValue(new Error('network error'));
            const { rerender } = render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );
            mockScrollTo.mockClear();

            await lastEditorProps.onPost?.({ type: 'doc', content: [] });
            rerender(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, newComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );

            expect(consoleError).toHaveBeenCalledWith('ActivityFeedV2: failed to post comment', expect.any(Error));
            expect(mockScrollTo).not.toHaveBeenCalled();
            consoleError.mockRestore();
        });

        test('should not scroll to a concurrent push that arrives without a user post', async () => {
            const { rerender } = render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment] as ActivityFeedV2Props['feedItems']}
                />,
            );
            mockScrollTo.mockClear();

            rerender(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, strangerComment] as ActivityFeedV2Props['feedItems']}
                />,
            );

            expect(mockScrollTo).not.toHaveBeenCalled();
        });

        test('should scroll to the user post even when a stranger post lands in the same render', async () => {
            const onCommentCreate = jest.fn();
            const { rerender } = render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );
            mockScrollTo.mockClear();

            await lastEditorProps.onPost?.({ type: 'doc', content: [] });
            rerender(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, newComment, strangerComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );

            expect(mockScrollTo).toHaveBeenCalledWith('new-comment');
            expect(mockScrollTo).not.toHaveBeenCalledWith('stranger-comment');
        });

        test('should not scroll when serializeEditorContent yields no text', async () => {
            mockSerializeMentionMarkup.mockReturnValue({ hasMention: false, text: '   ' });
            const onCommentCreate = jest.fn();
            const { rerender } = render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );
            mockScrollTo.mockClear();

            await lastEditorProps.onPost?.({ type: 'doc', content: [] });
            rerender(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, newComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );

            expect(onCommentCreate).not.toHaveBeenCalled();
            expect(mockScrollTo).not.toHaveBeenCalled();
        });

        test('should retry the scroll on the next feedItems change when scrollTo returns false', async () => {
            mockScrollTo.mockReturnValue(false);
            const onCommentCreate = jest.fn();
            const { rerender } = render(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );
            mockScrollTo.mockClear();
            mockScrollTo.mockReturnValue(false);

            await lastEditorProps.onPost?.({ type: 'doc', content: [] });
            rerender(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, newComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );
            expect(mockScrollTo).toHaveBeenLastCalledWith('new-comment');

            mockScrollTo.mockClear();
            mockScrollTo.mockReturnValue(true);
            rerender(
                <ActivityFeedV2
                    currentUser={mockCurrentUser}
                    feedItems={[mockComment, newComment, strangerComment] as ActivityFeedV2Props['feedItems']}
                    onCommentCreate={onCommentCreate}
                />,
            );

            expect(mockScrollTo).toHaveBeenLastCalledWith('new-comment');
        });
    });
});
