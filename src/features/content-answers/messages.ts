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
    maxCharactersReachedError: {
        defaultMessage: 'Maximum of {characterLimit} characters reached',
        description: 'Error tooltip to show inside text area if the user reached the character limit',
        id: 'boxui.contentAnswers.maxCharactersReachedError',
    },
});

export default messages;
