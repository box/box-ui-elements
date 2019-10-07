// @flow
import * as React from 'react';

import Tooltip from '../../components/tooltip';
import IconSecurityClassification from '../../icons/general/IconSecurityClassification';
import { SecurityBadge } from '../security';
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
        <SecurityBadge
            className="bdl-ClassifiedBadge"
            message={name}
            icon={<IconSecurityClassification color={bdlYellorange} height={10} width={10} strokeWidth={3} />}
        />
    </Tooltip>
);

export default ClassifiedBadge;
