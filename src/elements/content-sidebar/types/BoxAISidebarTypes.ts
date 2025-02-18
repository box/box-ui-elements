import { type QuestionType } from '@box/box-ai-content-answers';
import { type AgentState } from '@box/box-ai-agent-selector';

export type BoxAISidebarCache = { 
    agents: AgentState,
    encodedSession: string | null,
    questions: QuestionType[],
};

export type BoxAISidebarCacheSetter = (key: 'agents' | 'encodedSession' | 'questions', value: AgentState | QuestionType[] | string | null) => void;
