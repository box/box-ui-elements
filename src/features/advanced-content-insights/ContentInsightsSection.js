// @flow

import React from 'react';
import type { Node } from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import messages from '../unified-share-modal/messages';
import { bdlGray50 } from '../../styles/variables';
import Checkbox from '../../components/checkbox';
import DropdownMenu from '../../components/dropdown-menu';
import Gear from '../../icon/line/Gear16';
import IconInfo from '../../icons/general/IconInfo';
import { Menu, MenuItem } from '../../components/menu';
import PlainButton from '../../components/plain-button';
import Toggle from '../../components/toggle';
import Tooltip from '../../components/tooltip';
import { ITEM_TYPE_FILE } from '../../common/constants';

import type { item as itemtype } from '../unified-share-modal/flowTypes';
import type { contentInsightsConfigType } from './flowTypes';

type Props = {
    contentInsightsConfig?: contentInsightsConfigType,
    item: itemtype | null,
    onAdvancedInsightsEmailToggle?: (isEnabled: boolean) => void,
    onAdvancedInsightsNotificationToggle?: (isEnabled: boolean) => void,
    onAdvancedInsightsToggle?: (isEnabled: boolean) => void,
    renderOptionsInDropdown?: boolean,
    submitting: boolean,
};

type CheckboxWrapperProps = {
    children: Node,
    wrapComponent: boolean,
};

export const CheckboxWrapper = ({ wrapComponent, children }: CheckboxWrapperProps) =>
    wrapComponent ? <MenuItem>{children}</MenuItem> : children;

export default function ContentInsightsSection({
    contentInsightsConfig,
    item,
    onAdvancedInsightsEmailToggle = noop,
    onAdvancedInsightsNotificationToggle = noop,
    onAdvancedInsightsToggle = noop,
    renderOptionsInDropdown = false,
    submitting,
}: Props) {
    // TODO: Add extension/type checking, since we only support documents
    if (!contentInsightsConfig || !item || item.type !== ITEM_TYPE_FILE) {
        return null;
    }

    const { isActive, requireEmail, requireNotification } = contentInsightsConfig;
    const showDescriptionInTooltip = !renderOptionsInDropdown || isActive;
    const helpLink = !showDescriptionInTooltip && (
        <a href="https://support.box.com" rel="noopener noreferrer" target="_blank">
            <FormattedMessage {...messages.learnMore} />
        </a>
    );

    const advancedContentInsightsDescription = (
        <FormattedMessage {...messages.contentInsightsDescription} values={{ helpLink }} />
    );

    const renderCheckboxes = () => {
        //  Render the require email and require notification options
        return (
            <>
                <CheckboxWrapper wrapComponent={renderOptionsInDropdown}>
                    <Checkbox
                        isChecked={requireEmail}
                        label={<FormattedMessage {...messages.contentInsightsRequireEmail} />}
                        data-testid="require-email"
                        onChange={() => onAdvancedInsightsEmailToggle(!requireEmail)}
                        onClick={event => event.stopPropagation()}
                    />
                </CheckboxWrapper>
                <CheckboxWrapper wrapComponent={renderOptionsInDropdown}>
                    <Checkbox
                        isChecked={requireNotification}
                        label={<FormattedMessage {...messages.contentInsightsRequireNotify} />}
                        data-testid="require-notify"
                        onChange={() => onAdvancedInsightsNotificationToggle(!requireNotification)}
                        onClick={event => event.stopPropagation()}
                    />
                </CheckboxWrapper>
            </>
        );
    };

    const renderAdvancedContentInsightsOptions = () => {
        //  Render the require email and require notification options
        return (
            <>
                {!renderOptionsInDropdown && <div className="shared-link-checkgroup-row">{renderCheckboxes()}</div>}
                {renderOptionsInDropdown && (
                    <DropdownMenu className="ContentInsightsSection-dropdownMenu" isRightAligned>
                        <PlainButton type="button" data-testid="insights-options-dropdown-toggle">
                            <Gear />
                        </PlainButton>
                        <Menu>{renderCheckboxes()}</Menu>
                    </DropdownMenu>
                )}
            </>
        );
    };

    const renderToggle = () => {
        //  Render the require email and require notification options
        return (
            <div className="shared-link-toggle-row">
                <div className="ContentInsightsSection-toggle share-toggle-container">
                    <Toggle
                        isDisabled={submitting}
                        isOn={isActive}
                        label={<FormattedMessage {...messages.advancedInsights} />}
                        data-testid="insights-toggle"
                        onChange={() => onAdvancedInsightsToggle(!isActive)}
                    />
                    {showDescriptionInTooltip && (
                        <Tooltip text={advancedContentInsightsDescription}>
                            <span className="tooltip-icon-container" role="img">
                                <IconInfo color={bdlGray50} height={14} width={14} />
                            </span>
                        </Tooltip>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="be">
                {!renderOptionsInDropdown && <div className="bdl-SharedLinkSection-separator" />}
                {renderToggle()}
                {isActive && renderAdvancedContentInsightsOptions()}
            </div>
            {!showDescriptionInTooltip && (
                <div className="ContentInsightsSection-description">{advancedContentInsightsDescription}</div>
            )}
        </>
    );
}
