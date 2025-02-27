// This file contains TypeScript definitions converted from Flow types in core.js
import { DELIMITER_SLASH, DELIMITER_CARET } from '../../constants';

export type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;

export interface Crumb {
    id?: string;
    name: string;
}

export interface BoxPathCollection {
    entries: Crumb[];
    total_count: number;
}

export interface BoxItemPermission {
    can_annotate?: boolean;
    can_comment?: boolean;
    can_create_annotations?: boolean;
    can_delete?: boolean;
    can_download?: boolean;
    can_edit?: boolean;
    can_invite_collaborator?: boolean;
    can_preview?: boolean;
    can_rename?: boolean;
    can_set_share_access?: boolean;
    can_share?: boolean;
    can_upload?: boolean;
    can_view_annotations?: boolean;
    can_view_annotations_all?: boolean;
    can_view_annotations_self?: boolean;
}

export interface User {
    id: string;
    login: string;
    name: string;
    type: string;
}

export interface BoxItem {
    id: string;
    name?: string;
    path_collection?: BoxPathCollection;
    permissions?: BoxItemPermission;
    created_at?: string;
    created_by?: User;
    modified_at?: string;
    modified_by?: User;
    owned_by?: User;
    description?: string;
    size?: number;
    type?: string;
    extension?: string;
    url?: string;
}
