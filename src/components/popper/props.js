// @flow
import type { PopperArrowProps } from 'react-popper';
import type { Placement } from 'popper.js';

export type PopperChildrenProps = {
    arrowProps?: PopperArrowProps,
    outOfBoundaries?: ?boolean,
    placement?: Placement,
    scheduleUpdate?: () => void,
    style?: React.CSSProperties,
};
