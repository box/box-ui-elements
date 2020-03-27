// @flow
import * as React from 'react';

import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import IconSecurityClassification from '../../icons/general/IconSecurityClassification';
import SecurityBadge from '../security';
import { bdlYellorange, bdlYellorange10 } from '../../styles/variables';
import type { Position } from '../../components/tooltip';
import './ClassifiedBadge.scss';

type Props = {
    fillColor?: string,
    name: string,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
    strokeColor?: string,
    tooltipPosition?: Position,
    tooltipText?: string,
};

const ICON_SIZE = 10;

const ClassifiedBadge = ({
    fillColor,
    name,
    onClick,
    strokeColor,
    tooltipPosition = 'bottom-center',
    tooltipText,
}: Props) => {
    const isClickable = typeof onClick === 'function';
    const isTooltipDisabled = !tooltipText;
    const badge = (
        <SecurityBadge
            className="bdl-ClassifiedBadge"
            fillColor={fillColor}
            strokeColor={strokeColor}
            icon={
                <IconSecurityClassification color={strokeColor} height={ICON_SIZE} width={ICON_SIZE} strokeWidth={3} />
            }
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

ClassifiedBadge.defaultProps = {
    fillColor: bdlYellorange10,
    strokeColor: bdlYellorange,
};

export default ClassifiedBadge;
