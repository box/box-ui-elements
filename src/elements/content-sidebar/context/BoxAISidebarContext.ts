import * as React from 'react';
import noop from 'lodash/noop';
import { RecordActionType } from '@box/box-ai-agent-selector';
import type { ItemType, QuestionType } from '@box/box-ai-content-answers';

export interface BoxAISidebarContextValues {
    cache: { encodedSession?: string | null; questions?: QuestionType[] };
    contentName: string;
    elementId: string;
    fileExtension: string;
    isFeedbackEnabled: boolean;
    isStopResponseEnabled: boolean;
    items: Array<ItemType>;
    itemSize?: string;
    recordAction: (params: RecordActionType) => void;
    setCacheValue: (key: 'encodedSession' | 'questions', value: string | null | QuestionType[]) => void;
    userInfo: { name: string; avatarURL: string };
}

export const BoxAISidebarContext = React.createContext<BoxAISidebarContextValues>({
    cache: null,
    contentName: '',
    elementId: '',
    fileExtension: '',
    isFeedbackEnabled: false,
    isStopResponseEnabled: false,
    items: [],
    recordAction: noop,
    setCacheValue: noop,
    userInfo: { name: '', avatarURL: '' },
});
