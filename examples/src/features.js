// feature config for feature flags
export default {
    activityFeed: {
        tasks: {
            createFromComment: true,
            createButton: true,
            feedbackUrl: 'http://example.org/',
            newApi: true,
            newCards: true,
        },
        appActivity: {
            enabled: false,
        },
    },
    contentExplorer: {
        gridView: {
            enabled: false,
        },
    },
};
