/**
 * @flow
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import Button from 'box-react-ui/lib/components/button/Button';
import IconOpenWith from 'box-react-ui/lib/icons/general/IconOpenWith';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../Tooltip';
import OpenWithButtonContents from './OpenWithButtonContents';
import { CLASS_INTEGRATION_ICON } from '../../constants';
import messages from '../messages';
import getIcon from './IconFileMap';

type Props = {
    displayIntegration?: ?Integration,
    error: ?any,
    icon?: string,
    isLoading: boolean,
    onClick: Function,
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

const OpenWithButton = ({ error, onClick, displayIntegration, isLoading }: Props) => {
    const { displayName, isDisabled: isDisplayIntegrationDisabled, extension, disabledReasons, displayDescription } =
        displayIntegration || {};

    const isDisabled = !!isDisplayIntegrationDisabled || !displayName;

    const Icon = displayName ? getIcon(displayName) : IconOpenWith;

    return (
        <Tooltip text={getTooltip(displayDescription, isLoading, error, disabledReasons)} position="bottom-center">
            <Button isDisabled={isDisabled} onClick={() => onClick(displayIntegration)}>
                <OpenWithButtonContents>
                    <Icon extension={extension} className={CLASS_INTEGRATION_ICON} height={26} width={26} />
                </OpenWithButtonContents>
            </Button>
        </Tooltip>
    );
};

export default OpenWithButton;
