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
    const helpLink = !hasTooltip && (
        <a href="https://support.box.com" rel="noopener noreferrer" target="_blank">
            <FormattedMessage {...messages.learnMore} />
        </a>
    );

    const description = <FormattedMessage {...messages.advancedContentInsightsDescription} values={{ helpLink }} />;
    const label = (
        <>
            <FormattedMessage {...messages.advancedContentInsightsTitle} />
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
            description={!hasTooltip && description}
            isDisabled={isDisabled}
            isOn={isChecked}
            label={label}
            onChange={() => onChange(!isChecked)}
        />
    );
};

export default AdvancedContentInsightsToggle;
