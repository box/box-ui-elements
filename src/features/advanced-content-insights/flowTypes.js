// @flow
export type AdvancedContentInsightsType = {
    /** Whether the advanced content insights FF is enabled */
    enabled: boolean,
    isActive: boolean,
    onChange?: (isEnabled: boolean) => void,
    ownerEId?: number,
    userId?: number,
};
