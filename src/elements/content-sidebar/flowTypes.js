// @flow
import type { MessageDescriptor } from 'react-intl';
import type { SelectorItem, UserMini, GroupMini } from '../../common/types/core';
import type { UseTargetingApi } from '../../features/targeting/types';

type ClassificationInfo = {
    definition?: string,
    name: string,
};

type NavigateOptions = {
    isToggle?: boolean,
};

type AdditionalSidebarTabFtuxData = {
    targetingApi: UseTargetingApi,
    text: string,
};

type AdditionalSidebarTab = {
    callback: (callbackData: Object) => void,
    ftuxTooltipData?: AdditionalSidebarTabFtuxData,
    iconUrl?: string,
    id: number,
    title: ?string,
};

type Translations = {
    onTranslate?: Function,
    translationEnabled?: boolean,
};

type Collaborators = {
    entries: Array<SelectorItem<UserMini | GroupMini>>,
    next_marker: ?string,
};

type FileAccessStats = {
    comment_count?: number,
    download_count?: number,
    edit_count?: number,
    has_count_overflowed: boolean,
    preview_count?: number,
};

type MaskError = {
    errorHeader: MessageDescriptor,
    errorSubHeader?: MessageDescriptor,
};

type InlineError = {
    content: MessageDescriptor,
    title: MessageDescriptor,
};

type Errors = {
    error?: MessageDescriptor,
    inlineError?: InlineError,
    maskError?: MaskError,
};

export type {
    ClassificationInfo,
    NavigateOptions,
    AdditionalSidebarTab,
    AdditionalSidebarTabFtuxData,
    Translations,
    Collaborators,
    FileAccessStats,
    Errors,
};
