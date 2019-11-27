// @flow
import type { SelectorItem } from '../../common/types/core';

type ClassificationInfo = {
    definition?: string,
    name: string,
};

type NavigateOptions = {
    isToggle?: boolean,
};

type AdditionalSidebarTab = {
    callback: (callbackData: Object) => void,
    iconUrl?: string,
    id: number,
    title: ?string,
};

type Translations = {
    onTranslate?: Function,
    translationEnabled?: boolean,
};

type Collaborators = {
    entries: Array<SelectorItem>,
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
    Translations,
    Collaborators,
    FileAccessStats,
    Errors,
};
