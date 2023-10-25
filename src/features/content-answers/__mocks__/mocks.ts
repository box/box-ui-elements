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
    },
];

export const mockQuestionsWithAnswer: QuestionType[] = [
    {
        prompt: 'summarize another question',
        answer: 'summarize answer',
        createdAt: '',
    },
];

export const mockQuestionsWithError: QuestionType[] = [
    {
        prompt: 'summarize',
        answer: '',
        error: new Error('error'),
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

export const mockApiReturnError = {
    getIntelligenceAPI: jest.fn().mockReturnValue({
        ask: jest.fn().mockImplementation(() => {
            throw new Error('error');
        }),
    }),
    getUsersAPI: jest.fn().mockReturnValue({
        getUser: jest.fn().mockReturnValue({
            data: mockCurrentUser,
        }),
    }),
};
