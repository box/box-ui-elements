// @flow
import * as React from 'react';

import { BOX_BLUE } from '../../common/variables';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconPresenceInvite = ({ className = '', color = BOX_BLUE, height = 28, title, width = 28 }: Props) => (
    <AccessibleSVG
        className={`icon-presence-invite ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 28 28"
    >
        <g fill="none" fillRule="evenodd">
            <circle cx="14" cy="14" r="14" fill={color} />
            <path
                fill="#FFF"
                d="M16.389 12.012c-1.257-.096-2.487.382-3.31 1.288a.359.359 0 0 0 0 .449c.4.6.608 1.296.6 2.006v1.87c0 .207.177.375.395.375h5.53a.385.385 0 0 0 .395-.374v-1.714c.042-1.989-1.524-3.68-3.61-3.9z"
            />
            <circle cx="16" cy="9" r="2" fill="#FFF" />
            <circle cx="9" cy="9" r="2" fill="#FFF" />
            <path
                fill="#FFF"
                d="M8.608 12.018c-2.091.245-3.648 1.926-3.607 3.896v1.712c0 .207.179.374.4.374H12.6c.22 0 .4-.167.4-.374v-1.87c.005-1.058-.47-2.069-1.306-2.781a4.18 4.18 0 0 0-3.086-.957z"
            />
            <path
                fill="#FFF"
                fillRule="nonzero"
                stroke={color}
                d="M21.5 16.5h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 2 0v2z"
            />
        </g>
    </AccessibleSVG>
);

export default IconPresenceInvite;
