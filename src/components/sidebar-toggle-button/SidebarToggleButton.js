// @flow
import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import IconHide from '../../icons/general/IconHide';
import IconShow from '../../icons/general/IconShow';
import PlainButton from '../plain-button';
import Tooltip from '../tooltip';

import messages from '../../elements/common/messages';

import './SidebarToggleButton.scss';

type Props = {
    isOpen: Boolean,
    onClick?: Function,
} & InjectIntlProvidedProps;

const SidebarToggleButton = ({ intl, isOpen, onClick, ...rest }: Props) => {
    const isCollapsed = !isOpen ? 'collapsed' : '';
    const intlMessage = isOpen ? messages.sidebarHide : messages.sidebarShow;
    const intlText = intl.formatMessage(intlMessage);
    const classes = classNames({
        'bdl-SidebarToggleButton': true,
        'bdl-is-collapsed': isCollapsed,
    });

    return (
        <Tooltip position="middle-left" text={intlText}>
            <PlainButton aria-label={intlText} className={classes} onClick={onClick} type="button" {...rest}>
                {isOpen ? <IconHide height={16} width={16} /> : <IconShow height={16} width={16} />}
            </PlainButton>
        </Tooltip>
    );
};

export default injectIntl(SidebarToggleButton);
