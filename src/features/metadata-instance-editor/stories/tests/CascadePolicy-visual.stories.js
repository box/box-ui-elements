import * as React from 'react';
import { within, userEvent } from 'storybook/test';
import CascadePolicy from '../../CascadePolicy';
import messages from '../../messages';

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

export const DisabledCascadePolicyOptionsFieldsOnly = args => <CascadePolicy {...baseProps} {...args} />;

DisabledCascadePolicyOptionsFieldsOnly.args = {
    isExistingCascadePolicy: true,
};

DisabledCascadePolicyOptionsFieldsOnly.storyName = 'Disabled Cascade Policy Options';

export const DisabledCascadePolicyOptionsWithTooltip = args => <CascadePolicy {...baseProps} {...args} />;

DisabledCascadePolicyOptionsWithTooltip.args = {
    isExistingCascadePolicy: true,
};

DisabledCascadePolicyOptionsWithTooltip.storyName = 'Disabled Cascade Policy Options (Tooltip Visible)';

DisabledCascadePolicyOptionsWithTooltip.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const optionsText = canvas.getByText(messages.cascadePolicyModeQuestion.defaultMessage);
    await userEvent.hover(optionsText);
    // No assertion needed; Chromatic will snapshot with tooltip visible
};

export default {
    title: 'Features/Metadata Instance Editor/CascadePolicy/Visual',
    component: CascadePolicy,
};
