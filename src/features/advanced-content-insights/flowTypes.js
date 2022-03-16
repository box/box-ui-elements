// @flow
export type contentInsightsConfigType = {
    isActive: boolean,
    requireEmail: false,
    requireNotification: false,
};

export type ContentInsightsSectionTypes = {
    contentInsightsConfig?: contentInsightsConfigType,
    /** Whether the advanced content insights FF is enabled */
    isAdvancedContentInsightsEnabled?: boolean,
    onAdvancedInsightsEmailToggle?: (isEnabled: boolean) => void,
    onAdvancedInsightsNotificationToggle?: (isEnabled: boolean) => void,
    onAdvancedInsightsToggle?: (isEnabled: boolean) => void,
};

export type AdvancedContentInsights = {
    config: contentInsightsConfigType,
    enabled: boolean,
    ownerEId: number,
    userId: number,
};
