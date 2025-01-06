import { User } from '../common/types/core';

export interface Comment {
    created_at: string;
    created_by: User;
    id: string;
    message?: string;
    modified_at?: string;
    tagged_message: string;
    type: 'comment';
    replies?: Comment[];
}

export interface CommentFeedItemType extends Comment {
    isPending?: boolean;
}

export interface Annotation extends Comment {
    target: {
        location: {
            type: string;
            value: number;
        };
    };
}

export interface AnnotationPermission {
    can_delete: boolean;
    can_edit: boolean;
    can_reply: boolean;
    can_resolve: boolean;
}

export interface Annotations {
    entries: Array<Annotation>;
    limit: number;
    next_marker: string | null;
}

export interface AppActivityItems {
    rendered_text?: string;
    activity_template: {
        id: string;
        type: string;
    };
    created_by: User;
    created_at: string;
    permissions: {
        can_delete: boolean;
        can_edit: boolean;
    };
}

export interface BoxCommentPermission {
    can_delete?: boolean;
    can_edit?: boolean;
    can_reply?: boolean;
    can_resolve?: boolean;
}

export interface Comments {
    entries: Array<Comment>;
    limit: number;
    next_marker: string | null;
}

export interface FeedItem {
    created_at: string;
    created_by: User;
    id: string;
    status?: FeedItemStatus;
    type: string;
}

export type FeedItems = {
    [key: string]: FeedItem;
};

export type FeedItemStatus = 'open' | 'resolved' | 'rejected';

export interface FileActivity {
    activity_type: FileActivityTypes;
    source: {
        [key: string]: unknown;
    };
}

export type FileActivityTypes = 'annotation' | 'comment' | 'task' | 'version' | 'app_activity';

export interface Task {
    assigned_to: {
        entries: Array<{
            id: string;
            target: User;
            status: string;
        }>;
        limit: number;
        next_marker: string | null;
    };
    completion_rule?: string;
    created_by: User;
    created_at: string;
    due_at: string | null;
    id: string;
    message: string;
    task_type: string;
    status: string;
    type: string;
}

export interface Tasks {
    entries: Array<Task>;
    limit: number;
    next_marker: string | null;
}

export interface ThreadedComments {
    entries: Array<Comment>;
    limit: number;
    next_marker: string | null;
}
