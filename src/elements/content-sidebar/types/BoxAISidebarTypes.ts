import { type QuestionType, type SuggestedQuestionType } from '@box/box-ai-content-answers';
import { type AgentState } from '@box/box-ai-agent-selector';

export type BoxAISidebarCache = {
    agents: AgentState;
    encodedSession: string | null;
    questions: QuestionType[];
    shouldShowLandingPage: boolean;
    suggestedQuestions: SuggestedQuestionType[];
};

export type BoxAISidebarCacheSetter = (
    key: 'agents' | 'encodedSession' | 'questions' | 'shouldShowLandingPage' | 'suggestedQuestions',
    value: AgentState | QuestionType[] | SuggestedQuestionType[] | string | boolean | null,
) => void;

export type BoxAnnotationsBoundingBox = {
    /**
     * The unique id for the bounding box (used for UI state only)
     */
    id: string;
    /**
     * The x coordinate of the bounding box starting point (0-100 percentage of the width of the page)
     */
    x: number;
    /**
     * The y coordinate of the bounding box starting point (0-100 percentage of the height of the page)
     */
    y: number;
    /**
     * The width of the bounding box (0-100 percentage of the width of the page)
     */
    width: number;
    /**
     * The height of the bounding box (0-100 percentage of the height of the page)
     */
    height: number;
    /**
     * The page number of the bounding box (1-indexed)
     */
    pageNumber: number;
};
