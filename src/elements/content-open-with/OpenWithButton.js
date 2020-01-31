/**
 * @flow
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import Button from '../../components/button/Button';
import IconOpenWith from '../../icons/general/IconOpenWith';
import Tooltip from '../common/Tooltip';
import messages from '../common/messages';
import OpenWithButtonContents from './OpenWithButtonContents';
import utils from './openWithUtils';
import { CLASS_INTEGRATION_ICON, OPEN_WITH_BUTTON_ICON_SIZE } from '../../constants';
import getIcon from './IconFileMap';
import type { DisabledReason, Integration } from '../../common/types/integrations';

type Props = {
    displayIntegration?: ?Integration,
    error: ?any,
    icon?: string,
    isLoading: boolean,
    onClick?: Integration => void,
    tooltipText?: string | Object,
};

/**
 * Gets the tooltip text for the ContentOpenWith button
 *
 * @private
 * @return {?(string | Element)} the tooltip message
 */
export const getTooltip = (
    displayDescription: string,
    isLoading: boolean,
    error: ?Error,
    disabledReasons: Array<DisabledReason> = [],
): ?DisabledReason => {
    if (isLoading) {
        return null;
    }

    let message = <FormattedMessage {...messages.emptyOpenWithDescription} />;
    if (disabledReasons.length > 0) {
        [message] = disabledReasons;
    } else if (error) {
        message = <FormattedMessage {...messages.errorOpenWithDescription} />;
    } else if (displayDescription) {
        message = displayDescription;
    }

    return message;
};

const OpenWithButton = ({ error, onClick = noop, displayIntegration, isLoading }: Props) => {
    const { displayName, isDisabled: isDisplayIntegrationDisabled, extension, disabledReasons, displayDescription } =
        displayIntegration || {};

    const isDisabled = !!isDisplayIntegrationDisabled || !displayName;
    const Icon = displayName ? getIcon(displayName) : IconOpenWith;

    const tooltipDisplayProps = utils.isDisabledBecauseBoxToolsIsNotInstalled(displayIntegration)
        ? { isShown: true, showCloseButton: true }
        : {};

    return (
        <Tooltip
            className="bcow-tooltip"
            position="bottom-center"
            text={getTooltip(displayDescription, isLoading, error, disabledReasons)}
            {...tooltipDisplayProps}
        >
            <Button
                data-testid="singleintegrationbutton"
                isDisabled={isDisabled}
                onClick={() => (displayIntegration ? onClick(displayIntegration) : noop)}
            >
                <OpenWithButtonContents>
                    <Icon
                        className={CLASS_INTEGRATION_ICON}
                        dimension={OPEN_WITH_BUTTON_ICON_SIZE}
                        extension={extension}
                        height={OPEN_WITH_BUTTON_ICON_SIZE}
                        width={OPEN_WITH_BUTTON_ICON_SIZE}
                    />
                </OpenWithButtonContents>
            </Button>
        </Tooltip>
    );
};

export default OpenWithButton;
