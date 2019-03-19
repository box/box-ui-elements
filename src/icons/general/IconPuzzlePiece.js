// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    dimension?: number,
    title?: string,
};

const IconPuzzlePiece = ({ className = '', color = '#AFAFAF', dimension = 14, title }: Props) => (
    <AccessibleSVG
        className={`bdl-IconPuzzlePiece ${className}`}
        height={dimension}
        title={title}
        viewBox={`0 0 ${dimension} ${dimension}`}
        width={dimension}
    >
        <path
            d="M0 4.16v3c.17.85.65.93 1.15.8a1.72 1.72 0 0 1 1.31-.61 1.7 1.7 0 0 1 0 3.4 1.72 1.72 0 0 1-1.31-.61c-.5-.13-1-.05-1.15.8v3h9.84V11c.17-.85.64-.93 1.15-.8A1.7 1.7 0 1 0 11 8c-.51.13-1 0-1.15-.8v-3h-3C6 4 5.88 3.52 6 3a1.7 1.7 0 1 0-2.17 0c.13.51 0 1-.8 1.15z"
            fill={color}
        />
    </AccessibleSVG>
);

export default IconPuzzlePiece;
