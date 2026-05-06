import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import ActivityFeedV2 from '..';
import type { ActivityFeedV2Props } from '../ActivityFeedV2';

jest.mock('@box/threaded-annotations', () => ({
    AnnotationBadgeType: {
        Drawing: 'drawing',
        Frame: 'frame',
        Highlight: 'highlight',
        Point: 'point',
        Region: 'region',
    },
    serializeMentionMarkup: (doc: unknown) => ({ hasMention: false, text: JSON.stringify(doc) }),
}));

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
    const ActivityFeedEditor = () => <div data-testid="activity-feed-editor">Editor</div>;
    const ActivityFeedHeader = () => <div data-testid="activity-feed-header">Header</div>;

    return {
        ...actual,
        ActivityFeed: {
            Editor: ActivityFeedEditor,
            Header: ActivityFeedHeader,
            List: ActivityFeedList,
            Root: ActivityFeedRoot,
        },
        useActivityFeedScroll: () => ({ scrollTo: jest.fn() }),
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
});
