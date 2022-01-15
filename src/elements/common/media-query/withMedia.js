// @flow

import * as React from 'react';
import useMedia from './useMedia';
import {
    ANY_HOVER,
    ANY_POINTER_COARSE,
    ANY_POINTER_FINE,
    HOVER,
    POINTER_COARSE,
    POINTER_FINE,
    SIZE_SMALL,
    SIZE_MEDIUM,
    SIZE_LARGE,
    SIZE_XLARGE,
    POINTER_TYPE_NONE,
    POINTER_TYPE_COARSE,
    POINTER_TYPE_FINE,
    HOVER_TYPE_NONE,
    HOVER_TYPE_HOVER,
} from './constants';

type PropsShape = {
    children: React.Node,
};

type PointerType = POINTER_TYPE_NONE | POINTER_TYPE_FINE | POINTER_TYPE_COARSE;

type MediaShape = {
    anyHover: 'none' | 'hover',
    anyPointer: 'none' | 'fine' | 'coarse',
    hover: 'none' | 'hover',
    isExtraLarge: boolean,
    isLarge: boolean,
    isMedium: boolean,
    isSmall: boolean,
    pointer: 'none' | 'fine' | 'coarse',
};

const getPointerCapabilities: PointerType = (isFine: boolean, isCoarse: boolean) => {
    if (!isFine && !isCoarse) return POINTER_TYPE_NONE;
    if (isFine) return POINTER_TYPE_FINE;
    return POINTER_TYPE_COARSE;
};

function withMedia<Props: PropsShape>(WrappedComponent: React.ComponentType<any>): React.ComponentType<any> {
    return ({ children, ...rest }: Props) => {
        const isSmall: boolean = useMedia(SIZE_SMALL);
        const isMedium: boolean = useMedia(SIZE_MEDIUM);
        const isLarge: boolean = useMedia(SIZE_LARGE);
        const isExtraLarge: boolean = useMedia(SIZE_XLARGE);
        const isHover: boolean = useMedia(HOVER);
        const isAnyHover: boolean = useMedia(ANY_HOVER);

        const anyHover = isAnyHover ? HOVER_TYPE_HOVER : HOVER_TYPE_NONE;
        const hover = isHover ? HOVER_TYPE_HOVER : HOVER_TYPE_NONE;
        const pointer = getPointerCapabilities(useMedia(POINTER_FINE), useMedia(POINTER_COARSE));
        const anyPointer = getPointerCapabilities(useMedia(ANY_POINTER_FINE), useMedia(ANY_POINTER_COARSE));

        const mediaProps: MediaShape = {
            isSmall,
            isMedium,
            isLarge,
            isExtraLarge,
            anyHover,
            hover,
            pointer,
            anyPointer,
        };

        return (
            <WrappedComponent {...rest} {...mediaProps}>
                {children}
            </WrappedComponent>
        );
    };
}

export default withMedia;
