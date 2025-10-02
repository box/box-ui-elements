// @flow
import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import IconHide from '../../icons/general/IconHide';
import IconShow from '../../icons/general/IconShow';
import PlainButton from '../plain-button';
import Tooltip from '../tooltip';

import messages from '../../elements/common/messages';

import './SidebarToggleButton.scss';

const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

type Props = {
    className?: string,
    direction?: string,
    intl: IntlShape,
    isOpen: boolean,
    onClick?: Function,
};

const SidebarToggleButton = ({
    className = '',
    direction = DIRECTION_RIGHT,
    intl,
    isOpen,
    onClick,
    ...rest
}: Props) => {
    const isCollapsed = !isOpen ? 'collapsed' : '';
    const intlMessage = isOpen ? messages.sidebarHide : messages.sidebarShow;
    const intlText = intl.formatMessage(intlMessage);
    const classes = classNames(className, 'bdl-SidebarToggleButton', {
        'bdl-is-collapsed': isCollapsed,
    });
    const tooltipPosition = direction === DIRECTION_LEFT ? 'middle-right' : 'middle-left';

    const renderButton = () => {
        if (direction === DIRECTION_LEFT) {
            return isOpen ? <IconShow height={16} width={16} /> : <IconHide height={16} width={16} />;
        }
        return isOpen ? <IconHide height={16} width={16} /> : <IconShow height={16} width={16} />;
    };

    return (
        <Tooltip position={tooltipPosition} text={intlText}>
            <PlainButton aria-label={intlText} className={classes} onClick={onClick} type="button" {...rest}>
                {renderButton()}
            </PlainButton>
        </Tooltip>
    );
};

export default injectIntl(SidebarToggleButton);
