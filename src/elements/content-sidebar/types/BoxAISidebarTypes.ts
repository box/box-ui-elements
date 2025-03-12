import { type QuestionType , type SuggestedQuestionType } from '@box/box-ai-content-answers';
import { type AgentState } from '@box/box-ai-agent-selector';

export type BoxAISidebarCache = { 
    agents: AgentState,
    encodedSession: string | null,
    questions: QuestionType[],
    shouldShowLandingPage: boolean,
    suggestions: SuggestedQuestionType[],
};

export type BoxAISidebarCacheSetter = (key: 'agents' | 'encodedSession' | 'questions' | 'shouldShowLandingPage' | 'suggestions', value: AgentState | QuestionType[] | SuggestedQuestionType[] | string | boolean | null) => void;
