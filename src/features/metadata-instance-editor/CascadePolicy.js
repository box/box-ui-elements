// @flow
import * as React from 'react';

import { InlineNotice } from '@box/blueprint-web';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// $FlowFixMe
import { BoxAiAdvancedColor, BoxAiColor } from '@box/blueprint-web-assets/icons/Medium';
import { type AgentType } from '@box/box-ai-agent-selector';

// $FlowFixMe
import { BoxAiAgentSelectorWithApiContainer } from '@box/box-ai-agent-selector';

import Toggle from '../../components/toggle';
import { RadioButton, RadioGroup } from '../../components/radio';
import Link from '../../components/link/Link';
import IconAlertDefault from '../../icons/general/IconAlertDefault';
import messages from './messages';
import './CascadePolicy.scss';
import { STANDARD_AGENT_ID, ENHANCED_AGENT_ID, ENHANCED_AGENT_CONFIGURATION } from './constants';
import type { MetadataCascadePolicyConfiguration } from '../../common/types/metadata';

const COMMUNITY_LINK = 'https://support.box.com/hc/en-us/articles/360044195873-Cascading-metadata-in-folders';
const AI_LINK = 'https://www.box.com/ai';

type Props = {
    canEdit: boolean,
    canUseAIFolderExtraction: boolean,
    canUseAIFolderExtractionAgentSelector: boolean,
    cascadePolicyConfiguration?: MetadataCascadePolicyConfiguration,
    isAIFolderExtractionEnabled: boolean,
    isCascadingEnabled: boolean,
    isCascadingOverwritten: boolean,
    isCustomMetadata: boolean,
    isExistingCascadePolicy: boolean,
    onAIFolderExtractionToggle: (value: boolean) => void,
    onAIAgentSelect?: (agent: AgentType | null) => void,
    onCascadeModeChange: (value: boolean) => void,
    onCascadeToggle: (value: boolean) => void,
    shouldShowCascadeOptions: boolean,
};

const CascadePolicy = ({
    canEdit,
    canUseAIFolderExtraction,
    canUseAIFolderExtractionAgentSelector,
    cascadePolicyConfiguration,
    isCascadingEnabled,
    isCascadingOverwritten,
    isCustomMetadata,
    isAIFolderExtractionEnabled,
    isExistingCascadePolicy,
    onAIFolderExtractionToggle,
    onAIAgentSelect,
    onCascadeToggle,
    onCascadeModeChange,
    shouldShowCascadeOptions,
}: Props) => {
    const { formatMessage } = useIntl();

    const readOnlyState = isCascadingEnabled ? (
        <div className="metadata-cascade-notice">
            <FormattedMessage {...messages.metadataCascadePolicyEnabledInfo} />
        </div>
    ) : null;

    const isEnhancedAgentSelected = cascadePolicyConfiguration?.agent === ENHANCED_AGENT_CONFIGURATION;

    const agents = React.useMemo(
        () => [
            {
                id: STANDARD_AGENT_ID,
                name: formatMessage(messages.standardAgentName),
                isEnterpriseDefault: true,
            },
            {
                id: ENHANCED_AGENT_ID,
                name: formatMessage(messages.enhancedAgentName),
                isEnterpriseDefault: false,
                customIcon: BoxAiAdvancedColor,
                isSelected: isEnhancedAgentSelected,
            },
        ],
        [formatMessage, isEnhancedAgentSelected],
    );

    // BoxAiAgentSelectorWithApiContainer expects a function that returns a Promise<AgentListResponse>
    // Since we're passing in our own agents, we don't need to make an API call,
    // so we wrap the store data in a Promise to satisfy the component's interface requirements.
    const agentFetcher = useCallback(() => {
        return Promise.resolve({ agents });
    }, [agents]);

    const handleAgentSelect = useCallback(
        (agent: AgentType | null) => {
            if (onAIAgentSelect) {
                onAIAgentSelect(agent);
            }
        },
        [onAIAgentSelect],
    );

    return canEdit ? (
        <>
            {isExistingCascadePolicy && (
                <InlineNotice
                    variant="info"
                    variantIconAriaLabel={formatMessage(messages.cascadePolicyOptionsDisabledNoticeIconAriaLabel)}
                >
                    <FormattedMessage {...messages.cascadePolicyOptionsDisabledNotice} />
                </InlineNotice>
            )}
            <div className="metadata-cascade-editor">
                <div className="metadata-cascade-enable" data-testid="metadata-cascade-enable">
                    <div>
                        <FormattedMessage tagName="strong" {...messages.enableCascadePolicy} />
                        {!isCustomMetadata && (
                            <Toggle
                                aria-label={formatMessage(messages.enableCascadePolicy)}
                                className={`metadata-cascade-toggle ${
                                    isCascadingEnabled ? 'cascade-on' : 'cascade-off'
                                }`}
                                isOn={isCascadingEnabled}
                                label=""
                                onChange={e => onCascadeToggle(e.target.checked)}
                            />
                        )}
                    </div>
                    {!isCustomMetadata ? (
                        <div className="cascade-policy-text">
                            <FormattedMessage {...messages.applyCascadePolicyText} />
                            &nbsp;
                            <Link className="cascade-policy-link" href={COMMUNITY_LINK} target="_blank">
                                <FormattedMessage {...messages.cascadePolicyLearnMore} />
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <FormattedMessage {...messages.cannotApplyCascadePolicyText} />
                        </div>
                    )}
                </div>
            </div>
            {shouldShowCascadeOptions && (
                <div className="metadata-cascade-editor">
                    <div className="metadata-cascading-mode">
                        <FormattedMessage {...messages.cascadePolicyModeQuestion} />

                        <div className="metadata-operation-not-immediate">
                            <IconAlertDefault />
                            <span>
                                <FormattedMessage {...messages.operationNotImmediate} />
                            </span>
                        </div>
                        <RadioGroup
                            className="metadata-cascading-options"
                            onChange={e => onCascadeModeChange(e.target.value === 'overwrite')}
                            value={isCascadingOverwritten ? 'overwrite' : 'skip'}
                        >
                            <RadioButton
                                isDisabled={isExistingCascadePolicy}
                                label={<FormattedMessage {...messages.cascadePolicySkipMode} />}
                                value="skip"
                            />
                            <RadioButton
                                isDisabled={isExistingCascadePolicy}
                                label={<FormattedMessage {...messages.cascadePolicyOverwriteMode} />}
                                value="overwrite"
                            />
                        </RadioGroup>
                    </div>
                </div>
            )}
            {shouldShowCascadeOptions && canUseAIFolderExtraction && (
                <div className="metadata-cascade-editor" data-testid="ai-folder-extraction">
                    <div className="metadata-cascade-enable">
                        <div>
                            <BoxAiColor className="metadata-cascade-ai-logo" width={16} height={16} />
                            <FormattedMessage tagName="strong" {...messages.enableAIAutofill} />
                            <Toggle
                                aria-label={formatMessage(messages.enableAIAutofill)}
                                className="metadata-cascade-toggle"
                                isOn={isAIFolderExtractionEnabled}
                                isDisabled={isExistingCascadePolicy}
                                label=""
                                onChange={e => onAIFolderExtractionToggle(e.target.checked)}
                            />
                        </div>
                        <div className="cascade-policy-text">
                            <FormattedMessage {...messages.aiAutofillDescription} />
                            &nbsp;
                            <Link className="cascade-policy-link" href={AI_LINK} target="_blank">
                                <FormattedMessage {...messages.aiAutofillLearnMore} />
                            </Link>
                        </div>
                        {canUseAIFolderExtractionAgentSelector && isAIFolderExtractionEnabled && (
                            <div className="metadata-cascade-ai-agent-selector">
                                <BoxAiAgentSelectorWithApiContainer
                                    disabled={isExistingCascadePolicy}
                                    fetcher={agentFetcher}
                                    onSelectAgent={handleAgentSelect}
                                    recordAction={() => {}}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    ) : (
        readOnlyState
    );
};

export default CascadePolicy;
