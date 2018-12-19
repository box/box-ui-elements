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
import ICON_FILE_MAP from './IconFileMap';
import { CLASS_INTEGRATION_ICON } from '../../constants';
import messages from '../messages';

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
    disabledReasons: Array<string> = [],
    error: ?Error,
    isLoading: boolean,
): ?(string | Element) => {
    if (isLoading) {
        return null;
    }

    let message = '';
    if (disabledReasons[0]) {
        [message] = disabledReasons;
    } else if (error) {
        message = <FormattedMessage {...messages.errorOpenWithDescription} />;
    } else if (displayDescription) {
        message = displayDescription;
    }

    return message || <FormattedMessage {...messages.emptyOpenWithDescription} />;
};

const OpenWithButton = ({ error, onClick, displayIntegration, isLoading }: Props) => {
    const { displayName, isDisabled: isDisplayIntegrationDisabled, extension, disabledReasons, displayDescription } =
        displayIntegration || {};

    const isDisabled = !!isDisplayIntegrationDisabled || !displayName;

    const Icon = displayName ? ICON_FILE_MAP[displayName] : IconOpenWith;

    return (
        <Tooltip text={getTooltip(displayDescription, disabledReasons, error, isLoading)} position="bottom-center">
            <Button isDisabled={isDisabled} onClick={() => onClick(displayIntegration, isLoading)}>
                <OpenWithButtonContents>
                    <Icon extension={extension} className={CLASS_INTEGRATION_ICON} height={26} width={26} />
                </OpenWithButtonContents>
            </Button>
        </Tooltip>
    );
};

export default OpenWithButton;
