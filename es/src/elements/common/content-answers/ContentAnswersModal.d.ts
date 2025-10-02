import { SuggestedQuestionType } from '@box/box-ai-content-answers';
import APIFactory from '../../../api';
import { BoxItem } from '../../../common/types/core';
export interface ExternalProps {
    isCitationsEnabled?: boolean;
    isMarkdownEnabled?: boolean;
    onAsk?: () => void;
    onClearConversation?: () => void;
    onRequestClose?: () => void;
    suggestedQuestions?: SuggestedQuestionType[];
}
export interface ContentAnswersModalProps extends ExternalProps {
    api: APIFactory;
    file: BoxItem;
    isOpen: boolean;
}
declare const _default: any;
export default _default;
