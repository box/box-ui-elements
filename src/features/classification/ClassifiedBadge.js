// @flow
import * as React from 'react';

import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import IconSecurityClassification from '../../icons/general/IconSecurityClassification';
import SecurityBadge from '../security';
import { bdlYellorange } from '../../styles/variables';
import type { Position } from '../../components/tooltip';
import './ClassifiedBadge.scss';

type Props = {
    name: string,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
    tooltipPosition?: Position,
    tooltipText?: string,
};

const ClassifiedBadge = ({ name, onClick, tooltipPosition = 'bottom-center', tooltipText }: Props) => {
    const isClickable = typeof onClick === 'function';
    const isTooltipDisabled = !tooltipText;
    const badge = (
        <SecurityBadge
            className="bdl-ClassifiedBadge"
            icon={<IconSecurityClassification color={bdlYellorange} height={10} width={10} strokeWidth={3} />}
            message={name}
        />
    );
    return (
        <Tooltip isDisabled={isTooltipDisabled} isTabbable={false} position={tooltipPosition} text={tooltipText}>
            {isClickable ? (
                <PlainButton
                    className="bdl-ClassifiedBadge-editButton"
                    data-resin-target="editclassification"
                    onClick={onClick}
                    type="button"
                >
                    {badge}
                </PlainButton>
            ) : (
                badge
            )}
        </Tooltip>
    );
};

export default ClassifiedBadge;
