/**
 * @flow
 * @file Flow types for Activity Feed
 * @author Box
 */

import type { SelectorItems, User } from '../../../flowTypes';

export type Comments = {
    create?: Function,
    delete?: Function
};

export type Tasks = {
    create?: Function,
    delete?: Function,
    edit?: Function,
    onTaskAssignmentUpdate?: Function
};

export type Contacts = {
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function
};

export type Versions = {
    info?: Function
};

export type InputState = {
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    currentUser: User,
    isDisabled?: boolean
};

export type Item = {
    action: string,
    type?: 'comment' | 'task' | 'file_version' | 'keywords',
    collaborators: Object,
    createdAt?: any,
    createdBy: User,
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
