// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconEyeHidden = ({ className = '', color = '#222', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`bdl-IconEyeHidden ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <g className="fill-color" fill={color} fillRule="evenodd">
            <path
                d="M10.222 5.981l-.708.709a2.008 2.008 0 0 0-2.931-.102A1.99 1.99 0 0 0 6 8.005a1.983 1.983 0 0 0 .69 1.508l-.708.709A2.983 2.983 0 0 1 5 8.002a2.986 2.986 0 0 1 .875-2.121 3.008 3.008 0 0 1 4.347.1zm.55.865c.15.362.23.754.228 1.153a2.984 2.984 0 0 1-.875 2.12 3.009 3.009 0 0 1-3.278.651l.802-.801a2.006 2.006 0 0 0 1.769-.557c.375-.374.584-.881.582-1.416 0-.118-.01-.234-.03-.349l.802-.801zm1.22-2.636l-.724.725A6.26 6.26 0 0 0 8.001 4C5.454 4 3.113 5.61 2.079 8a6.718 6.718 0 0 0 2.91 3.214l-.732.732a7.75 7.75 0 0 1-3.195-3.79L1 8l.061-.157C2.174 5.015 4.908 3 8.001 3c1.454 0 2.828.445 3.992 1.21zm.806.61a7.76 7.76 0 0 1 2.14 3.024L15 8l-.061.157C13.828 10.986 11.094 13 8 13a7.17 7.17 0 0 1-2.808-.575l.773-.774A6.15 6.15 0 0 0 8.001 12c2.548 0 4.888-1.61 5.92-4a6.74 6.74 0 0 0-1.832-2.472l.709-.708z"
                fillRule="nonzero"
            />
            <path d="M13.328 1.49l.707.707-12.02 12.02-.708-.707z" />
        </g>
    </AccessibleSVG>
);

export default IconEyeHidden;
