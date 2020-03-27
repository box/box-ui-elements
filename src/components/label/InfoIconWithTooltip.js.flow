// @flow
import * as React from 'react';

import IconInfo from '../../icons/general/IconInfo';
import Tooltip from '../tooltip';

type Props = {
    className?: string,
    iconProps?: Object,
    tooltipText: React.Node,
};

const InfoIconWithTooltip = ({ className = '', iconProps, tooltipText }: Props) => (
    <span key="infoIcon" className={`${className} tooltip-icon-container`}>
        <Tooltip position="top-center" text={tooltipText}>
            <span className="info-icon-container">
                <IconInfo height={16} width={16} {...iconProps} />
            </span>
        </Tooltip>
    </span>
);

export default InfoIconWithTooltip;
