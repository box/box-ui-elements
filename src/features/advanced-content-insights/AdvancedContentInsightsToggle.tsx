import React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import InfoBadge16 from '../../icon/fill/InfoBadge16';
// @ts-ignore flow import
import Toggle from '../../components/toggle';
import Tooltip from '../../components/tooltip';

import messages from './messages';

import './AdvancedContentInsightsToggle.scss';

interface Props {
    hasTooltip?: boolean;
    isChecked?: boolean;
    isDisabled: boolean;
    onChange?: (isEnabled: boolean) => void;
}

const AdvancedContentInsightsToggle = ({
    hasTooltip = true,
    isChecked = false,
    isDisabled,
    onChange = noop,
}: Props) => {
    const description = <FormattedMessage {...messages.advancedContentInsightsDescription} />;
    const label = (
        <>
            <FormattedMessage
                {...(isChecked
                    ? { ...messages.advancedContentInsightsTitleEnabled }
                    : { ...messages.advancedContentInsightsTitleDisabled })}
            />
            {hasTooltip && (
                <Tooltip text={description}>
                    <div className="AdvancedContentInsightsToggle-icon">
                        <InfoBadge16 height={14} width={14} />
                    </div>
                </Tooltip>
            )}
        </>
    );

    return (
        <Toggle
            className="AdvancedContentInsightsToggle"
            data-testid="insights-toggle"
            description={!hasTooltip && !isChecked && description}
            isDisabled={isDisabled}
            isOn={isChecked}
            label={label}
            onChange={() => onChange(!isChecked)}
        />
    );
};

export default AdvancedContentInsightsToggle;
