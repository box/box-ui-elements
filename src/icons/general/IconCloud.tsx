import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { Icon } from '../iconTypes';

interface IconCloudProps extends Icon {
    /** An object describing the filter effects for the icon */
    filter?: {
        definition?: React.ReactNode;
        id?: string;
    };
}

const IconCloud = ({ className = '', filter = {}, height = 64, title, width = 64 }: IconCloudProps) => {
    const { id: filterID, definition } = filter;
    return (
        <AccessibleSVG
            className={`icon-cloud ${className}`}
            height={height}
            title={title}
            viewBox="0 0 64 64"
            width={width}
        >
            {definition ? <defs>{definition}</defs> : null}
            <path
                d="M60.4 36.8c0-5-4-9-9-9-.4 0-.9 0-1.3.1C49.1 20 42.4 14 34.3 14c-5.8 0-10.8 3.1-13.6 7.7-1.1-.3-2.3-.5-3.6-.5-6.8 0-12.3 5.5-12.3 12.3 0 6.7 5.4 12.2 12.1 12.3h34.4c5.1-.1 9.1-4.1 9.1-9z"
                filter={filterID ? `url(#${filterID})` : undefined}
            />
        </AccessibleSVG>
    );
};

export default IconCloud;
