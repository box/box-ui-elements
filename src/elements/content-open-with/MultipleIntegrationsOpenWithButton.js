/**
 * @flow
 * @file Open With button when multiple integrations are present
 * @author Box
 */

import * as React from 'react';
import MenuToggle from 'components/dropdown-menu/MenuToggle';
import IconOpenWith from 'icons/general/IconOpenWith';
import Button from 'components/button/Button';
import { FormattedMessage } from 'react-intl';
import Tooltip from 'elements/common/Tooltip';
import messages from 'elements/common/messages';
import OpenWithButtonContents from './OpenWithButtonContents';
import { CLASS_INTEGRATION_ICON, OPEN_WITH_BUTTON_ICON_SIZE } from '../../constants';

type Props = {
    buttonProps?: ?Object,
};

const MultipleIntegrationsOpenWithButton = (buttonProps: Props) => (
    <Tooltip text={<FormattedMessage {...messages.defaultOpenWithDescription} />} position="middle-left">
        <Button data-testid="multipleintegrationsbutton" {...buttonProps}>
            <MenuToggle>
                <OpenWithButtonContents>
                    <IconOpenWith
                        className={CLASS_INTEGRATION_ICON}
                        dimension={OPEN_WITH_BUTTON_ICON_SIZE}
                        height={OPEN_WITH_BUTTON_ICON_SIZE}
                        width={OPEN_WITH_BUTTON_ICON_SIZE}
                    />
                </OpenWithButtonContents>
            </MenuToggle>
        </Button>
    </Tooltip>
);

export default MultipleIntegrationsOpenWithButton;
