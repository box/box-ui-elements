/**
 * @flow
 * @file Flow types for Activity Feed
 * @author Box
 */

export type Comments = {
    create: Function,
    delete: Function
};

export type Tasks = {
    create?: Function,
    delete?: Function,
    edit?: Function,
    onTaskAssignmentUpdate?: Function
};

export type Contacts = {
    getApproverWithQuery: Function,
    getMentionWithQuery: Function
};

export type Versions = {
    info: Function
};

export type SelectorItem = {
    id?: string,
    name: string
};

export type SelectorItems = Array<SelectorItem>;

export type InputState = {
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    currentUser: User,
    isDisabled?: boolean
};

export type Item = {
    type?: 'comment' | 'task' | 'file_version' | 'keywords',
    createdAt?: any,
    createdBy: User,
    id: string
};

export type Translations = {
    translationEnabled?: boolean,
    onTranslate?: boolean
};
