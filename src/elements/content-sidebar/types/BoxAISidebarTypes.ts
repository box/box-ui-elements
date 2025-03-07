import { type QuestionType } from '@box/box-ai-content-answers';
import { type AgentState } from '@box/box-ai-agent-selector';

export type BoxAISidebarCache = { 
    agents: AgentState,
    encodedSession: string | null,
    questions: QuestionType[],
    shouldShowLandingPage: boolean,
};

export type BoxAISidebarCacheSetter = (key: 'agents' | 'encodedSession' | 'questions' | 'shouldShowLandingPage', value: AgentState | QuestionType[] | string | boolean | null) => void;
