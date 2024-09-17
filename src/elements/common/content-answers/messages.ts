import { defineMessages } from 'react-intl';

const messages = defineMessages({
    contentAnswersTitle: {
        defaultMessage: 'Box AI',
        description: 'Content Answers feature name shown on menu item and modal title',
        id: 'boxui.contentAnswers.contentAnswersTitle',
    },
    defaultTooltip: {
        defaultMessage: 'Get instant answers about this document using Box AI',
        description: 'Default tooltip message for Content Answers entry point button',
        id: 'boxui.contentAnswers.defaultTooltip',
    },
    disabledTooltipFileNotCompatible: {
        defaultMessage: 'Box AI is not currently supported for this file type',
        description:
            'Disabled tooltip message for Content Answers entry point button when the file type is not supported',
        id: 'boxui.contentAnswers.disabledTooltipFileNotCompatible',
    },
    hasQuestionsTooltip: {
        defaultMessage: 'Return to Box AI',
        description: 'Existing questions tooltip message for Content Answers entry point button',
        id: 'boxui.contentAnswers.hasQuestionsTooltip',
    },
    documentSuggestedQuestionLabel1: {
        defaultMessage: 'Summarize this document',
        description: 'Text inside the chip for the first suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionLabel1',
    },
    documentSuggestedQuestionPrompt1: {
        defaultMessage: 'Summarize this document',
        description: 'Actual prompt for the first suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionPrompt1',
    },
    documentSuggestedQuestionLabel2: {
        defaultMessage: 'What are the key takeaways?',
        description: 'Text inside the chip for the second suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionLabel2',
    },
    documentSuggestedQuestionPrompt2: {
        defaultMessage: 'What are the key takeaways?',
        description: 'Actual prompt for the second suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionPrompt2',
    },
    documentSuggestedQuestionLabel3: {
        defaultMessage: 'How can this document be improved?',
        description: 'Text inside the chip for the third suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionLabel3',
    },
    documentSuggestedQuestionPrompt3: {
        defaultMessage: 'How can this document be improved?',
        description: 'Actual prompt for the third suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionPrompt3',
    },
    documentSuggestedQuestionLabel4: {
        defaultMessage: 'Are there any next steps defined?',
        description: 'Text inside the chip for the fourth suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionLabel4',
    },
    documentSuggestedQuestionPrompt4: {
        defaultMessage: 'Are there any next steps defined?',
        description: 'Actual prompt for the fourth suggested question for documents',
        id: 'enduser.contentAnswers.documentSuggestedQuestionPrompt4',
    },
});

export default messages;
