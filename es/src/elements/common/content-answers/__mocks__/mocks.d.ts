/// <reference types="jest" />
import { QuestionType } from '@box/box-ai-content-answers';
export declare const mockFile: {
    id: string;
    name: string;
    extension: string;
};
export declare const mockQuestionsNoAnswer: QuestionType[];
export declare const mockQuestionsWithAnswer: QuestionType[];
export declare const mockQuestionsWithError: QuestionType[];
export declare const mockQuestionsWithAnswerAndNoAnswer: QuestionType[];
export declare const mockApi: {
    getIntelligenceAPI: jest.Mock<any, any, any>;
};
export declare const mockApiReturnError: {
    getIntelligenceAPI: jest.Mock<any, any, any>;
};
