/**
 * @flow
 * @file Open With button when multiple integrations are present
 * @author Box
 */

import * as React from 'react';
import MenuToggle from 'box-react-ui/lib/components/dropdown-menu/MenuToggle';
import IconOpenWith from 'box-react-ui/lib/icons/general/IconOpenWith';
import Button from 'box-react-ui/lib/components/button/Button';
import { FormattedMessage } from 'react-intl';
import OpenWithButtonContents from './OpenWithButtonContents';
import Tooltip from '../common/Tooltip';
import { CLASS_INTEGRATION_ICON, OPEN_WITH_BUTTON_ICON_SIZE } from '../../constants';
import messages from '../common/messages';

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
