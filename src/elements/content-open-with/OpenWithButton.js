/**
 * @flow
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import Button from 'box-react-ui/lib/components/button/Button';
import IconOpenWith from 'box-react-ui/lib/icons/general/IconOpenWith';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import Tooltip from 'elements/common/Tooltip';
import messages from 'elements/common/messages';
import OpenWithButtonContents from './OpenWithButtonContents';
import utils from './openWithUtils';
import { CLASS_INTEGRATION_ICON, OPEN_WITH_BUTTON_ICON_SIZE } from '../../constants';
import getIcon from './IconFileMap';

type Props = {
    displayIntegration?: ?Integration,
    error: ?any,
    icon?: string,
    isLoading: boolean,
    onClick?: Function,
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
): ?(string | Element) => {
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
            text={getTooltip(displayDescription, isLoading, error, disabledReasons)}
            position="bottom-center"
            {...tooltipDisplayProps}
        >
            <Button
                data-testid="singleintegrationbutton"
                isDisabled={isDisabled}
                onClick={() => onClick(displayIntegration)}
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
