/**
 * @flow
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import Button from 'box-react-ui/lib/components/button/Button';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import Tooltip from 'box-react-ui/lib/components/tooltip/Tooltip';
import { injectIntl, FormattedMessage } from 'react-intl';
import ICON_FILE_MAP from './IconFileMap';
import messages from '../messages';

type Props = {
    error: ?Error,
    displayIntegration?: Integration | Object,
    numIntegrations: number,
    onClick: ?Function,
    tooltipText?: string | Object,
    icon?: string,
};

/**
 * Gets the tooltip text for the OpenWith button
 *
 * @private
 * @return {string | Element}
 */
const getTooltip = (
    error: ?Error,
    displayIntegration: ?Integration,
    numIntegrations: number,
): string | Element => {
    if (error) {
        return <FormattedMessage {...messages.errorOpenWithDescription} />;
    }
    if (displayIntegration) {
        return displayIntegration.displayDescription;
    }
    if (numIntegrations > 1) {
        return <FormattedMessage {...messages.defaultOpenWithDescription} />;
    }

    return <FormattedMessage {...messages.emptyOpenWithDescription} />;
};

const OpenWithButton = ({
    error,
    numIntegrations,
    onClick,
    displayIntegration,
}: Props) => {
    const {
        displayName = null,
        appIntegrationId = null,
        isDisabled: isDisplayIntegrationDisabled = false,
    } = displayIntegration || {};

    const isDisabled =
        !!isDisplayIntegrationDisabled || !!error || numIntegrations === 0;
    const IntegrationIcon = displayName && ICON_FILE_MAP[displayName];
    const Icon = IntegrationIcon || IconFileDefault;

    return (
        <Tooltip
            text={getTooltip(error, displayIntegration, numIntegrations)}
            position="bottom-center"
        >
            <Button
                isDisabled={isDisabled}
                onClick={onClick}
                data-attribute-id={appIntegrationId}
            >
                <Icon
                    height={26}
                    width={26}
                    className={IntegrationIcon ? 'integration-icon' : ''}
                />
                <FormattedMessage {...messages.open} />
            </Button>
        </Tooltip>
    );
};

export default injectIntl(OpenWithButton);
