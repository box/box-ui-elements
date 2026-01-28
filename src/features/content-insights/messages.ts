import { defineMessages } from 'react-intl';

const messages = defineMessages({
    contentAnalyticsErrorText: {
        defaultMessage: 'There was a problem loading content insights. Please try again.',
        description: 'Text shown to users when opening the content insights flyout and there is an error',
        id: 'be.contentInsights.contentAnalyticsErrorText',
    },
    contentAnalyticsPermissionError: {
        defaultMessage: 'Oops! You no longer have access to view content insights.',
        description: 'Message shown when the user does not have access to view content insights anymore',
        id: 'be.contentInsights.contentAnalyticsPermissionError',
    },
    contentInsightsTitle: {
        defaultMessage: 'Content Insights',
        description: 'Title for Content Insights section in file sidebar',
        id: 'be.contentInsights.contentInsightsTitle',
    },
    downloadGraphLabel: {
        defaultMessage: 'Chart displaying the number of downloads over the selected time period',
        description: 'Label for the chart displaying the number of downloads over the selected time period',
        id: 'be.contentInsights.downloadGraphLabel',
    },
    downloadGraphType: {
        defaultMessage: 'DOWNLOADS',
        description: 'Title for the content insights graph card regarding number of Previews',
        id: 'be.contentInsights.downloadGraphType',
    },
    trendMonth: {
        defaultMessage: 'PAST MONTH',
        description:
            'Trend description for the content insights graph card regarding the count of events from the past month',
        id: 'be.contentInsights.trendMonth',
    },
    trendThreeMonths: {
        defaultMessage: 'PAST 3 MONTHS',
        description:
            'Trend description for the content insights graph card regarding the count of events from the past three months',
        id: 'be.contentInsights.trendThreeMonths',
    },
    trendWeek: {
        defaultMessage: 'PAST WEEK',
        description:
            'Trend description for the content insights graph card regarding the count of events from the past week',
        id: 'be.contentInsights.trendWeek',
    },
    trendYear: {
        defaultMessage: 'PAST YEAR',
        description:
            'Trend description for the content insights graph card regarding the count of events from the past year',
        id: 'be.contentInsights.trendYear',
    },
    trendDown: {
        defaultMessage: 'Trending down',
        description: 'Label for the arrow indicator in the trend pill',
        id: 'be.contentInsights.trendDown',
    },
    trendUp: {
        defaultMessage: 'Trending up',
        description: 'Label for the arrow indicator in the trend pill',
        id: 'be.contentInsights.trendUp',
    },
    peopleGraphLabel: {
        defaultMessage: 'Chart displaying the number of users over the selected time period',
        description: 'Label for the chart displaying the number of users over the selected time period',
        id: 'be.contentInsights.peopleGraphLabel',
    },
    peopleTitle: {
        defaultMessage: 'PEOPLE',
        description: 'Title used to represent how many users have interacted with the file',
        id: 'be.contentInsights.peopleTitle',
    },
    previewGraphLabel: {
        defaultMessage: 'Chart displaying the number of previews over the selected time period',
        description: 'Label for the chart displaying the number of previews over the selected time period',
        id: 'be.contentInsights.previewGraphLabel',
    },
    previewGraphType: {
        defaultMessage: 'Previews',
        description: 'Title for the content insights graph card regarding number of Previews',
        id: 'be.contentInsights.previewGraphType',
    },
    openContentInsightsButton: {
        defaultMessage: 'See Details',
        description: 'Open Content Insights button which opens the Content Insights Modal',
        id: 'be.contentInsights.openContentInsightsButton',
    },
});

export default messages;
