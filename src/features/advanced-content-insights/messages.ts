import { defineMessages } from 'react-intl';

const messages = defineMessages({
    advancedContentInsightsTitle: {
        defaultMessage: 'Advanced Insights',
        description: 'Advanced Content Insights toggle title',
        id: 'be.advancedContentInsights.advancedContentInsightsTitle',
    },
    advancedContentInsightsDescription: {
        defaultMessage:
            'Get actionable insights into how viewers are engaging with this content. Measure average time spent, page-by-page engagement, per person and per visit details. {helpLink}',
        description: 'Description text about advanced content insights.',
        id: 'be.advancedContentInsights.advancedContentInsightsDescription',
    },
    learnMore: {
        defaultMessage: 'Learn more.',
        description:
            'Text for a link that go to an external page with more information about Advanced Content Insights',
        id: 'be.advancedContentInsights.learnMore',
    },
});

export default messages;
