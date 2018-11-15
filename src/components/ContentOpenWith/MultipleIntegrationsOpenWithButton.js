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
import Tooltip from '../Tooltip';
import { CLASS_INTEGRATION_ICON } from '../../constants';
import messages from '../messages';

type Props = {
    buttonProps?: ?Object,
};

const MultipleIntegrationsOpenWithButton = (buttonProps: Props) => (
    <Tooltip text={<FormattedMessage {...messages.defaultOpenWithDescription} />} position="middle-left">
        <Button {...buttonProps}>
            <MenuToggle>
                <OpenWithButtonContents>
                    <IconOpenWith height={26} width={26} className={CLASS_INTEGRATION_ICON} />
                </OpenWithButtonContents>
            </MenuToggle>
        </Button>
    </Tooltip>
);

export default MultipleIntegrationsOpenWithButton;
