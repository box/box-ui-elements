// eslint-disable-next-line import/prefer-default-export
import { QuestionType } from '../ContentAnswersModal';

export const mockCurrentUser = {
    id: '123',
    name: 'g w',
};

export const mockFile = {
    id: '123',
    name: 'filename',
    extension: 'doc',
};

export const mockQuestionsNoAnswer: QuestionType[] = [
    {
        prompt: 'summarize',
        error: null,
    },
];

export const mockQuestionsWithAnswer: QuestionType[] = [
    {
        prompt: 'summarize another question',
        answer: 'summarize answer',
        createdAt: '',
        error: null,
    },
];

export const mockQuestionsWithAnswerAndNoAnswer: QuestionType[] = [
    ...mockQuestionsWithAnswer,
    ...mockQuestionsNoAnswer,
];

export const mockApi = {
    getIntelligenceAPI: jest.fn().mockReturnValue({
        ask: jest.fn().mockReturnValue({
            data: mockQuestionsWithAnswer[0],
        }),
    }),
    getUsersAPI: jest.fn().mockReturnValue({
        getUser: jest.fn().mockReturnValue({
            data: mockCurrentUser,
        }),
    }),
};
