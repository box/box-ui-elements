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
        id: 'boxui.contentAnswers.documentSuggestedQuestionLabel1',
    },
    documentSuggestedQuestionPrompt1: {
        defaultMessage: 'Summarize this document',
        description: 'Actual prompt for the first suggested question for documents',
        id: 'boxui.contentAnswers.documentSuggestedQuestionPrompt1',
    },
    documentSuggestedQuestionLabel2: {
        defaultMessage: 'What are the key takeaways?',
        description: 'Text inside the chip for the second suggested question for documents',
        id: 'boxui.contentAnswers.documentSuggestedQuestionLabel2',
    },
    documentSuggestedQuestionPrompt2: {
        defaultMessage: 'What are the key takeaways?',
        description: 'Actual prompt for the second suggested question for documents',
        id: 'boxui.contentAnswers.documentSuggestedQuestionPrompt2',
    },
    documentSuggestedQuestionLabel3: {
        defaultMessage: 'How can this document be improved?',
        description: 'Text inside the chip for the third suggested question for documents',
        id: 'boxui.contentAnswers.documentSuggestedQuestionLabel3',
    },
    documentSuggestedQuestionPrompt3: {
        defaultMessage: 'How can this document be improved?',
        description: 'Actual prompt for the third suggested question for documents',
        id: 'boxui.contentAnswers.documentSuggestedQuestionPrompt3',
    },
    documentSuggestedQuestionLabel4: {
        defaultMessage: 'Are there any next steps defined?',
        description: 'Text inside the chip for the fourth suggested question for documents',
        id: 'boxui.contentAnswers.documentSuggestedQuestionLabel4',
    },
    documentSuggestedQuestionPrompt4: {
        defaultMessage: 'Are there any next steps defined?',
        description: 'Actual prompt for the fourth suggested question for documents',
        id: 'boxui.contentAnswers.documentSuggestedQuestionPrompt4',
    },
    imageSuggestedQuestionLabel1: {
        defaultMessage: 'Describe this image',
        description: 'Text inside the chip for the first suggested question for images',
        id: 'boxui.contentAnswers.imageSuggestedQuestionLabel1',
    },
    imageSuggestedQuestionPrompt1: {
        defaultMessage: 'Describe this image',
        description: 'Actual prompt for the first suggested question for images',
        id: 'boxui.contentAnswers.imageSuggestedQuestionPrompt1',
    },
    imageSuggestedQuestionLabel2: {
        defaultMessage: 'What stands out in this image?',
        description: 'Text inside the chip for the second suggested question for images',
        id: 'boxui.contentAnswers.imageSuggestedQuestionLabel2',
    },
    imageSuggestedQuestionPrompt2: {
        defaultMessage: 'What stands out in this image?',
        description: 'Actual prompt for the second suggested question for images',
        id: 'boxui.contentAnswers.imageSuggestedQuestionPrompt2',
    },
    welcomeMessageIntelligentQueryNotice: {
        defaultMessage: 
            'You can ask Box AI both simple and complex questions in your spreadsheet: total counts, averages, advanced comparisons, trend analyses and so on. Try it out today!',
        description: 'Content Answers welcome message spreadsheet supported by Intelligent Query notification',
        id: 'boxui.contentAnswers.welcomeMessageIntelligentQueryNotice',
    },
    welcomeMessageSpreadsheetNotice: {
        defaultMessage: 'Spreadsheet support works best for text dense files',
        description: 'Content Answers welcome message spreadsheet notification',
        id: 'boxui.contentAnswers.welcomeMessageSpreadsheetNotice',
    },
    welcomeMessageSpreadsheetNoticeAriaLabel: {
        defaultMessage: 'spreadsheet support notification banner',
        description: 'Aria label for the icon inside spreadsheet notification',
        id: 'boxui.contentAnswers.welcomeMessageSpreadsheetNoticeAriaLabel',
    },
});

export default messages;
