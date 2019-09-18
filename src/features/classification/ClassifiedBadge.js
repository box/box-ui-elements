// @flow
import * as React from 'react';

import Tooltip from '../../components/tooltip';
import IconSecurityClassification from '../../icons/general/IconSecurityClassification';
import { bdlYellorange } from '../../styles/variables';
import type { Position } from '../../components/tooltip';
import './ClassifiedBadge.scss';

type Props = {
    name: string,
    tooltipPosition?: Position,
    tooltipText?: string,
};

const ClassifiedBadge = ({ name, tooltipPosition = 'bottom-center', tooltipText }: Props) => (
    <Tooltip isDisabled={!tooltipText} position={tooltipPosition} text={tooltipText} isTabbable={false}>
        <h1 className="bdl-ClassifiedBadge">
            <IconSecurityClassification color={bdlYellorange} height={10} width={10} strokeWidth={3} />
            <span className="bdl-ClassifiedBadge-name">{name}</span>
        </h1>
    </Tooltip>
);

export default ClassifiedBadge;
