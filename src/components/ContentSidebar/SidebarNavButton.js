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
    children: React.Node
};

const SidebarNavButton = ({ tooltip, isSelected, onClick, interactionTarget, children }: Props) => (
    <Tooltip text={tooltip} position='middle-left'>
        <div
            className={classNames('bcs-nav-btn', {
                'bcs-nav-btn-is-selected': isSelected
            })}
        >
            <div className='bcs-nav-btn-border' />
            <PlainButton type='button' onClick={onClick} data-resin-target={interactionTarget}>
                {children}
            </PlainButton>
        </div>
    </Tooltip>
);

export default SidebarNavButton;
