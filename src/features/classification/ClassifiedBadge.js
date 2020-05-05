// @flow
import * as React from 'react';

import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import IconSecurityClassification from '../../icons/general/IconSecurityClassification';
import SecurityBadge from '../security';
import { bdlYellow50 } from '../../styles/variables';
import type { Position } from '../../components/tooltip';
import './ClassifiedBadge.scss';

type Props = {
    color?: string,
    name: string,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
    tooltipPosition?: Position,
    tooltipText?: string,
};

const ICON_SIZE = 12;

const ClassifiedBadge = ({ color, name, onClick, tooltipPosition = 'bottom-center', tooltipText }: Props) => {
    const isClickable = typeof onClick === 'function';
    const isTooltipDisabled = !tooltipText;
    const badge = (
        <SecurityBadge
            className="bdl-ClassifiedBadge"
            color={color}
            icon={<IconSecurityClassification height={ICON_SIZE} width={ICON_SIZE} />}
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
    color: bdlYellow50,
};

export default ClassifiedBadge;
