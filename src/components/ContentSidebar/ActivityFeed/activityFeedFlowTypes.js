/**
 * @flow
 * @file Flow types for Activity Feed
 * @author Box
 */

import type { SelectorItems, User, Comment, Task, Version } from '../../../flowTypes';

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

export type FeedItems = Array<Comment | Task | Version>;

export type Translations = {
    translationEnabled?: boolean,
    onTranslate?: Function
};
