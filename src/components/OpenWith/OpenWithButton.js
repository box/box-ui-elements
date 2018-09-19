/**
 * @flow
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import Button from 'box-react-ui/lib/components/button/Button';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../Tooltip';
import OpenWithButtonContents from './OpenWithButtonContents';
import ICON_FILE_MAP from './IconFileMap';
import messages from '../messages';

type Props = {
    displayIntegration?: ?Integration,
    error: ?Error,
    icon?: string,
    isLoading: boolean,
    onClick: ?Function,
    tooltipText?: string | Object,
};

/**
 * Gets the tooltip text for the OpenWith button
 *
 * @private
 * @return {?(string | Element)} the tooltip message
 */
const getTooltip = (
    displayDescription: ?string,
    error: ?Error,
    isLoading: boolean,
): ?(string | Element) => {
    if (isLoading) {
        return null;
    }
    if (error) {
        return <FormattedMessage {...messages.errorOpenWithDescription} />;
    }
    if (displayDescription) {
        return displayDescription;
    }

    return <FormattedMessage {...messages.emptyOpenWithDescription} />;
};

const OpenWithButton = ({
    error,
    onClick,
    displayIntegration,
    isLoading,
}: Props) => {
    const {
        appIntegrationId: id,
        displayDescription,
        displayName,
        isDisabled: isDisplayIntegrationDisabled,
    } = displayIntegration || {};

    const isDisabled = !!isDisplayIntegrationDisabled || !displayName;
    const IntegrationIcon = displayName && ICON_FILE_MAP[displayName];
    const Icon = IntegrationIcon || IconFileDefault;

    return (
        <Tooltip
            text={getTooltip(displayDescription, error, isLoading)}
            position="bottom-center"
        >
            <Button
                isDisabled={isDisabled}
                onClick={onClick ? () => onClick(id) : noop}
            >
                <OpenWithButtonContents>
                    <Icon
                        className={
                            IntegrationIcon ? 'bcow-integration-icon' : ''
                        }
                        height={26}
                        width={26}
                    />
                </OpenWithButtonContents>
            </Button>
        </Tooltip>
    );
};

export default OpenWithButton;
