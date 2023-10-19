import { defineMessages } from 'react-intl';

const messages = defineMessages({
    ask: {
        defaultMessage: 'Ask',
        description: 'Content Answers submit input button text',
        id: 'boxui.contentAnswers.ask',
    },
    askDisabledTooltip: {
        defaultMessage: 'You can submit another question once Box AI has finished responding',
        description: 'Content Answers submit input button disabled tooltip text when answer is generating',
        id: 'boxui.contentAnswers.askDisabledTooltip',
    },
    askQuestionPlaceholder: {
        defaultMessage: 'Ask anything about this document',
        description: 'Content Answers modal input placeholder',
        id: 'boxui.contentAnswers.askQuestionPlaceholder',
    },
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
    inlineErrorText: {
        defaultMessage: 'The Box AI service was unavailable.',
        description: 'Content Answers error message when the service fails',
        id: 'boxui.contentAnswers.inlineErrorText',
    },
    intelligenceUnavailableDescription: {
        defaultMessage: 'The Box AI service is not responding.',
        description: 'Box AI Q&A service unavailable error description',
        id: 'boxui.contentAnswers.intelligenceUnavailableDescription',
    },
    intelligenceUnavailableHeading: {
        defaultMessage: 'Box AI is unavailable',
        description: 'Box AI Q&A service unavailable error title',
        id: 'boxui.contentAnswers.intelligenceUnavailableHeading',
    },
    intelligenceUnavailableTryAgain: {
        defaultMessage: 'Please try again later.',
        description: 'Box AI Q&A service unavailable error try again later description',
        id: 'boxui.contentAnswers.intelligenceUnavailableTryAgain',
    },
    maxCharactersReachedError: {
        defaultMessage: 'Maximum of {characterLimit} characters reached',
        description: 'Error tooltip to show inside text area if the user reached the character limit',
        id: 'boxui.contentAnswers.maxCharactersReachedError',
    },
    retryResponse: {
        defaultMessage: 'Retry',
        description: 'Retry button label to send again the question to the service',
        id: 'boxui.contentAnswers.retryResponse',
    },
    welcomeAskQuestionText: {
        defaultMessage: 'Ask questions about {name}',
        description: 'Content Answers welcome message for asking questions',
        id: 'boxui.contentAnswers.welcomeAskQuestionText',
    },
    welcomeClearChatText: {
        defaultMessage: 'This chat will be cleared when you close this document',
        description: 'Content Answers welcome message for clearing the chat',
        id: 'boxui.contentAnswers.welcomeClearChatText',
    },
    welcomeMessageTitle: {
        defaultMessage: 'Welcome to Box AI',
        description: 'Content Answers welcome message title',
        id: 'boxui.contentAnswers.welcomeMessageTitle',
    },
});

export default messages;
