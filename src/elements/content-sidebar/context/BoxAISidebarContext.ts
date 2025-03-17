import * as React from 'react';
import noop from 'lodash/noop';
import { RecordActionType as AgentSelectorRecordActionType } from '@box/box-ai-agent-selector';
import { RecordActionType as ContentAnswersRecordActionType } from '@box/box-ai-content-answers';
import type { ItemType } from '@box/box-ai-content-answers';
import type { BoxAISidebarCache, BoxAISidebarCacheSetter } from '../types/BoxAISidebarTypes';

type BoxAISidebarRecordActionType =
    | AgentSelectorRecordActionType
    | ContentAnswersRecordActionType
    | (Omit<ContentAnswersRecordActionType, 'data'> & {
          data: {
              items: Array<Pick<ItemType, 'fileType' | 'status'>>;
          };
      });

export interface BoxAISidebarContextValues {
    cache: BoxAISidebarCache;
    contentName: string;
    elementId: string;
    fileExtension: string;
    isFeedbackEnabled: boolean;
    isStopResponseEnabled: boolean;
    items: Array<ItemType>;
    itemSize?: string;
    onUserInteraction?: () => void;
    recordAction: (params: BoxAISidebarRecordActionType) => void;
    setCacheValue: BoxAISidebarCacheSetter;
    shouldPreinitSession: boolean;
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
    shouldPreinitSession: true,
});
