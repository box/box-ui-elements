/**
 * @flow
 * @file Flow types for Activity Feed
 * @author Box
 */

import type { SelectorItems, User } from '../../../flowTypes';

export type CommentHandlers = {
    create?: Function,
    delete?: Function
};

export type TaskHandlers = {
    create?: Function,
    delete?: Function,
    edit?: Function,
    onTaskAssignmentUpdate?: Function
};

export type ContactHandlers = {
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function
};

export type VersionHandlers = {
    info?: Function
};

export type InputState = {
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    currentUser?: User,
    isDisabled?: boolean
};

export type Item = {
    action: string,
    type?: 'comment' | 'task' | 'file_version' | 'keywords',
    collaborators: Object,
    createdAt?: any,
    createdBy?: User,
    modifiedAt?: any,
    modifiedBy?: User,
    id: string,
    versions: Array<any>,
    versionNumber: number,
    versionStart: number,
    versionEnd: number
};

export type Translations = {
    translationEnabled?: boolean,
    onTranslate?: Function
};
