import * as React from 'react';
import CascadePolicy from '../../CascadePolicy';

const baseProps = {
    canEdit: true,
    canUseAIFolderExtraction: true,
    canUseAIFolderExtractionAgentSelector: true,
    isAIFolderExtractionEnabled: false,
    isCascadingEnabled: true,
    isCascadingOverwritten: false,
    isCustomMetadata: false,
    onAIFolderExtractionToggle: () => {},
    onCascadeModeChange: () => {},
    onCascadeToggle: () => {},
    shouldShowCascadeOptions: true,
};

const EnabledCascadePolicyOptionsFieldsOnly = () => <CascadePolicy {...baseProps} isExistingCascadePolicy={false} />;
EnabledCascadePolicyOptionsFieldsOnly.storyName = 'Enabled Cascade Policy Options';

const DisabledCascadePolicyOptionsFieldsOnly = () => <CascadePolicy {...baseProps} isExistingCascadePolicy={true} />;
DisabledCascadePolicyOptionsFieldsOnly.storyName = 'Disabled Cascade Policy Options';

export { EnabledCascadePolicyOptionsFieldsOnly, DisabledCascadePolicyOptionsFieldsOnly };

export default {
    title: 'Features/Metadata Instance Editor/CascadePolicy/Visual',
    component: CascadePolicy,
};
