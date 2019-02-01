// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Toggle from 'components/toggle';
import { RadioButton, RadioGroup } from 'components/radio';
import Link from 'components/link/Link';
import messages from './messages';
import './CascadePolicy.scss';

const COMMUNITY_LINK = 'https://community.box.com/t5/Organizing-and-Tracking-Content/Metadata/ta-p/30765';

type Props = {
    canEdit: boolean,
    isCascadingEnabled: boolean,
    isCascadingOverwritten: boolean,
    isCustomMetadata: boolean,
    onCascadeModeChange: (value: boolean) => void,
    onCascadeToggle: (value: boolean) => void,
    shouldShowCascadeOptions: boolean,
};

const CascadePolicy = ({
    canEdit,
    isCascadingEnabled,
    isCascadingOverwritten,
    isCustomMetadata,
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
        <div className="metadata-cascade-editor">
            <div className="metadata-cascade-enable">
                <div>
                    <FormattedMessage tagName="strong" {...messages.enableCascadePolicy} />
                    {!isCustomMetadata && (
                        <Toggle
                            className={`metadata-cascade-toggle ${isCascadingEnabled ? 'cascade-on' : 'cascade-off'}`}
                            isOn={isCascadingEnabled}
                            label=""
                            onChange={e => onCascadeToggle(e.target.checked)}
                        />
                    )}
                </div>
                {!isCustomMetadata ? (
                    <div>
                        <FormattedMessage {...messages.applyCascadePolicyText} />
                        &nbsp;
                        <Link className="cascade-policy-learnmore-link" href={COMMUNITY_LINK} target="_blank">
                            <FormattedMessage {...messages.cascadePolicyLearnMore} />
                        </Link>
                    </div>
                ) : (
                    <div>
                        <FormattedMessage {...messages.cannotApplyCascadePolicyText} />
                    </div>
                )}
            </div>
            {shouldShowCascadeOptions && (
                <React.Fragment>
                    <hr />
                    <div className="metadata-cascading-mode">
                        <FormattedMessage {...messages.cascadePolicyModeQuestion} />
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
                </React.Fragment>
            )}
        </div>
    ) : (
        readOnlyState
    );
};

export default CascadePolicy;
