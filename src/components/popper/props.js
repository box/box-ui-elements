// @flow
import * as React from 'react';
// $FlowFixMe
import type { PopperArrowProps, PopperProps } from 'react-popper';

export type PopperChildrenProps = {
    arrowProps?: PopperArrowProps,
    outOfBoundaries?: ?boolean,
    placement?: PopperProps.placement,
    update?: () => void,
    // $FlowFixMe https://github.com/facebook/flow/issues/5192
    style?: React.CSSProperties,
};
