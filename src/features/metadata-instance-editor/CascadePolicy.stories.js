import * as React from 'react';

import CascadePolicy from './CascadePolicy';

export const withoutAIMetadataExtraction = () => (
    <CascadePolicy
        canEdit
        isCascadingEnabled
        onCascadeModeChange={() => {}}
        onCascadeToggle={() => {}}
        shouldShowCascadeOptions
    />
);

export const withAIMetadataExtraction = () => (
    <CascadePolicy
        canEdit
        canUseAIFolderExtraction
        isAIFolderExtractionEnabled
        isCascadingEnabled
        onAIFolderExtractionToggle={() => {}}
        onCascadeModeChange={() => {}}
        onCascadeToggle={() => {}}
        shouldShowCascadeOptions
    />
);

export default {
    title: 'Features/Metadata Instance Editor/CascadePolicy',
    component: CascadePolicy,
};
