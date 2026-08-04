import type { CSSProperties } from 'react';
import type { PopperArrowProps } from 'react-popper';
import type { Placement } from 'popper.js';

export interface PopperChildrenProps {
    /** Props to apply to the popper arrow element */
    arrowProps?: PopperArrowProps;
    /** Whether the popper content is outside its boundaries */
    outOfBoundaries?: boolean | null;
    /** Calculated placement of the popper content */
    placement?: Placement;
    /** Recalculates the popper position */
    scheduleUpdate?: () => void;
    /** Calculated positioning styles for the popper content */
    style?: CSSProperties;
}
