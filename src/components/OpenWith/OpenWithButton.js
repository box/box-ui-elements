/**
 * @flow
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import Button from 'box-react-ui/lib/components/button/Button';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import { injectIntl, FormattedMessage } from 'react-intl';
import Tooltip from '../Tooltip';
import OpenWithButtonContents from './OpenWithButtonContents';
import ICON_FILE_MAP from './IconFileMap';
import messages from '../messages';

type Props = {
    error: ?Error,
    displayIntegration?: Integration | Object,
    onClick: ?Function,
    tooltipText?: string | Object,
    icon?: string,
    isLoading: boolean,
};

/**
 * Gets the tooltip text for the OpenWith button
 *
 * @private
 * @return {?(string | Element)} the tooltip message
 */
const getTooltip = (
    error: ?Error,
    displayDescription: ?string,
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
        isDisabled: isDisplayIntegrationDisabled,
        displayName,
        displayDescription,
        appIntegrationId: id,
    } = displayIntegration || {};

    const isDisabled = !!isDisplayIntegrationDisabled || !displayName;
    const IntegrationIcon = displayName && ICON_FILE_MAP[displayName];
    const Icon = IntegrationIcon || IconFileDefault;

    return (
        <Tooltip
            text={getTooltip(error, displayDescription, isLoading)}
            position="bottom-center"
        >
            <Button
                isDisabled={isDisabled}
                onClick={onClick}
                data-attribute-id={id}
            >
                <OpenWithButtonContents>
                    <Icon
                        height={26}
                        width={26}
                        className={IntegrationIcon ? 'integration-icon' : ''}
                    />
                </OpenWithButtonContents>
            </Button>
        </Tooltip>
    );
};

export default injectIntl(OpenWithButton);
