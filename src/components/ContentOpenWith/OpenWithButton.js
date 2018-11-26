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
export const getTooltip = (displayDescription: ?string, error: ?any, isLoading: boolean): ?(string | Element) => {
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

const OpenWithButton = ({ error, onClick, displayIntegration, isLoading }: Props) => {
    const { displayDescription, displayName, isDisabled: isDisplayIntegrationDisabled } = displayIntegration || {};

    const isDisabled = !!isDisplayIntegrationDisabled || !displayName;
    const IntegrationIcon = displayName && ICON_FILE_MAP[displayName];
    const Icon = IntegrationIcon || IconOpenWith;

    return (
        <Tooltip text={getTooltip(displayDescription, error, isLoading)} position="bottom-center">
            <Button isDisabled={isDisabled} onClick={() => onClick(displayIntegration)}>
                <OpenWithButtonContents>
                    <Icon className={CLASS_INTEGRATION_ICON} height={26} width={26} />
                </OpenWithButtonContents>
            </Button>
        </Tooltip>
    );
};

export default OpenWithButton;
