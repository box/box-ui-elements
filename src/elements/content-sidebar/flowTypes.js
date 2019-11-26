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

export type { ClassificationInfo, NavigateOptions, AdditionalSidebarTab, Translations, Collaborators };
