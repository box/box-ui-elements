// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { BoxAiAgentSelector } from '@box/box-ai-agent-selector';
import { InlineNotice, TooltipProvider } from '@box/blueprint-web';
// $FlowFixMe
import BoxAiLogo from '@box/blueprint-web-assets/icons/Logo/BoxAiLogo';

import Toggle from '../../components/toggle';
import { RadioButton, RadioGroup } from '../../components/radio';
import Link from '../../components/link/Link';
import IconAlertDefault from '../../icons/general/IconAlertDefault';
import messages from './messages';
import './CascadePolicy.scss';

const COMMUNITY_LINK = 'https://support.box.com/hc/en-us/articles/360044195873-Cascading-metadata-in-folders';
const AI_LINK = 'https://www.box.com/ai';
const PRICING_LINK = 'https://www.box.com/pricing';

const agents = [
    {
        id: '1',
        name: 'Basic',
        isEnterpriseDefault: true,
    },
    {
        id: '2',
        name: 'Enhanced (Gemini 2.5 Pro)',
        isEnterpriseDefault: false,
    },
];

type Props = {
    canEdit: boolean,
    canUseAIFolderExtraction: boolean,
    isAIFolderExtractionEnabled: boolean,
    isCascadingEnabled: boolean,
    isCascadingOverwritten: boolean,
    isCustomMetadata: boolean,
    onAIFolderExtractionToggle: (value: boolean) => void,
    onCascadeModeChange: (value: boolean) => void,
    onCascadeToggle: (value: boolean) => void,
    shouldShowCascadeOptions: boolean,
};

const CascadePolicy = ({
    canEdit,
    canUseAIFolderExtraction,
    isCascadingEnabled,
    isCascadingOverwritten,
    isCustomMetadata,
    isAIFolderExtractionEnabled,
    onAIFolderExtractionToggle,
    onCascadeToggle,
    onCascadeModeChange,
    shouldShowCascadeOptions,
}: Props) => {
    const readOnlyState = isCascadingEnabled ? (
        <div className="metadata-cascade-notice">
            <FormattedMessage {...messages.metadataCascadePolicyEnabledInfo} />
        </div>
    ) : null;

    return canEdit ? (
        <>
            <div className="metadata-cascade-editor">
                <div className="metadata-cascade-enable">
                    <div>
                        <FormattedMessage tagName="strong" {...messages.enableCascadePolicy} />
                        {!isCustomMetadata && (
                            <Toggle
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
                                label={<FormattedMessage {...messages.cascadePolicySkipMode} />}
                                value="skip"
                            />
                            <RadioButton
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
                            <BoxAiLogo className="metadata-cascade-ai-logo" width={16} height={16} />
                            <FormattedMessage tagName="strong" {...messages.enableAIAutofill} />
                            <Toggle
                                className="metadata-cascade-toggle"
                                isOn={isAIFolderExtractionEnabled}
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
                        <div className="metadata-cascade-ai-agent-selector">
                            <TooltipProvider>
                                <BoxAiAgentSelector
                                    agents={agents}
                                    onErrorAction={() => {}}
                                    requestState="success"
                                    selectedAgent={agents[0]}
                                    variant="sidebar"
                                />
                            </TooltipProvider>
                        </div>
                        <InlineNotice className="metadata-cascade-ai-notice" variant="info">
                            <FormattedMessage
                                {...messages.aiAutofillNotice}
                                values={{
                                    pricingLink: (
                                        <Link className="cascade-policy-link" href={PRICING_LINK} target="_blank">
                                            <FormattedMessage {...messages.aiAutofillPricingDetails} />
                                        </Link>
                                    ),
                                }}
                            />
                        </InlineNotice>
                    </div>
                </div>
            )}
        </>
    ) : (
        readOnlyState
    );
};

export default CascadePolicy;
