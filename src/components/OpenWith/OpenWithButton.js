/**
 * @flow
 * @file Preview Open With button
 * @author Box
 */

import * as React from 'react';
import Button from 'box-react-ui/lib/components/button/Button';
import { injectIntl, FormattedMessage } from 'react-intl';
import WithTooltip from './WithTooltip';
import ICON_FILE_MAP from './IconFileMap';
import messages from '../messages';

type Props = {
    extension: ?string,
    displayIntegration: ?Integration,
    onClick: ?Function,
    tooltipText?: string | Object,
    isDisabled: boolean,
    isLoading: boolean,
    icon?: string,
};

const INTEGRATION_ICON_CLASS = 'integration-icon';

const OpenWithButton = ({
    extension,
    onClick,
    displayIntegration,
    tooltipText,
    isDisabled = false,
    isLoading = true,
}: Props) => {
    const { displayName = null, appIntegrationId = null } =
        displayIntegration || {};
    let DisplayIcon = ICON_FILE_MAP[displayName || 'default'];

    let iconProps = {
        height: 26,
        width: 26,
        className: INTEGRATION_ICON_CLASS,
    };

    if (isLoading) {
        iconProps = {
            dimension: 26,
        };
    } else if (!displayName) {
        iconProps = {
            dimension: 26,
            extension: extension || null,
        };
    }

    return (
        <WithTooltip tooltipText={tooltipText} position="bottom-center">
            <Button
                isDisabled={isDisabled || isLoading}
                onClick={onClick}
                data-attribute-id={appIntegrationId}
            >
                <DisplayIcon {...iconProps} />
                <FormattedMessage {...messages.open} />
            </Button>
        </WithTooltip>
    );
};

export default injectIntl(OpenWithButton);
