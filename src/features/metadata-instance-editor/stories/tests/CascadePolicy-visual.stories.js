import * as React from 'react';
import { TooltipProvider } from '@box/blueprint-web';
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

const Template = props => (
    <TooltipProvider>
        <CascadePolicy {...baseProps} {...props} />
    </TooltipProvider>
);

const EnabledCascadePolicyOptionsFieldsOnly = () => <Template isExistingCascadePolicy={false} />;
EnabledCascadePolicyOptionsFieldsOnly.storyName = 'Enabled Cascade Policy Options';

const DisabledCascadePolicyOptionsFieldsOnly = () => <Template isExistingCascadePolicy={true} />;
DisabledCascadePolicyOptionsFieldsOnly.storyName = 'Disabled Cascade Policy Options';

export { EnabledCascadePolicyOptionsFieldsOnly, DisabledCascadePolicyOptionsFieldsOnly };

export default {
    title: 'Features/Metadata Instance Editor/CascadePolicy/Visual',
    component: CascadePolicy,
};
