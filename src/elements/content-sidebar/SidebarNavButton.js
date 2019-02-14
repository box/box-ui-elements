/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from '../../components/plain-button/PlainButton';
import Tooltip from '../../components/tooltip/Tooltip';
import './SidebarNavButton.scss';

type Props = {
    children: React.Node,
    interactionTarget: string,
    isSelected: boolean,
    onClick: Function,
    tooltip: React.Node,
};

const SidebarNavButton = ({ tooltip, isSelected, onClick, interactionTarget, children }: Props) => {
    const buttonClass = classNames('bcs-nav-btn', {
        'bcs-nav-btn-is-selected': isSelected,
    });

    return (
        <Tooltip position="middle-left" text={tooltip}>
            <PlainButton
                className={buttonClass}
                data-resin-target={interactionTarget}
                data-testid={interactionTarget}
                onClick={onClick}
                type="button"
            >
                {children}
            </PlainButton>
        </Tooltip>
    );
};

export default SidebarNavButton;
