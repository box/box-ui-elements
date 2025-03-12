import { type QuestionType , type SuggestedQuestionType } from '@box/box-ai-content-answers';
import { type AgentState } from '@box/box-ai-agent-selector';

export type BoxAISidebarCache = { 
    agents: AgentState,
    encodedSession: string | null,
    suggestions: SuggestedQuestionType[],
    questions: QuestionType[],
};

export type BoxAISidebarCacheSetter = (key: 'agents' | 'encodedSession' | 'suggestions' | 'questions', value: AgentState | SuggestedQuestionType[] | QuestionType[] | string | null) => void;
