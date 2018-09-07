/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import Tooltip from 'box-react-ui/lib/components/tooltip/Tooltip';
import './SidebarNavButton.scss';

type Props = {
    tooltip: React.Node,
    isSelected: boolean,
    onClick: Function,
    interactionTarget: string,
    children: React.Node,
};

const SidebarNavButton = ({
    tooltip,
    isSelected,
    onClick,
    interactionTarget,
    children,
}: Props) => {
    const buttonClass = classNames('bcs-nav-btn', {
        'bcs-nav-btn-is-selected': isSelected,
    });

    return (
        <Tooltip text={tooltip} position="middle-left">
            <PlainButton
                className={buttonClass}
                type="button"
                onClick={onClick}
                data-resin-target={interactionTarget}
            >
                {children}
            </PlainButton>
        </Tooltip>
    );
};

export default SidebarNavButton;
