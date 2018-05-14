/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import Tooltip from 'box-react-ui/lib/components/tooltip/Tooltip';

type Props = {
    tooltip: React.Node,
    className: string,
    onClick: Function,
    interactionTarget: string,
    children: React.Node
};

const SidebarNavButton = ({ tooltip, className, onClick, interactionTarget, children }: Props) => (
    <Tooltip text={tooltip} position='middle-left'>
        <PlainButton type='button' className={className} onClick={onClick} data-resin-target={interactionTarget}>
            {children}
        </PlainButton>
    </Tooltip>
);

export default SidebarNavButton;
