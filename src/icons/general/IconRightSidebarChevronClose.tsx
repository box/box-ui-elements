import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import { Icon } from '../iconTypes';

// Copied from Figma - will replace with blueprint icon once available
const IconRightSidebarChevronClose = ({ className = '', color = '#000000', height = 24, title, width = 24 }: Icon) => (
    <AccessibleSVG className={`icon-show ${className}`} title={title} width={width} height={height} viewBox="0 0 24 24">
        <path
            d="M15.707 9.29297C15.3165 8.90245 14.6835 8.90245 14.293 9.29297C13.9024 9.68349 13.9024 10.3165 14.293 10.707L15.5859 12L14.293 13.293C13.9024 13.6835 13.9024 14.3165 14.293 14.707C14.6835 15.0975 15.3165 15.0975 15.707 14.707L17.707 12.707C18.0975 12.3165 18.0975 11.6835 17.707 11.293L15.707 9.29297Z"
            fill={color}
            fill-opacity="0.6"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7 4C4.23858 4 2 6.23858 2 9V15C2 17.7614 4.23858 20 7 20H17C19.6753 20 21.8595 17.8989 21.9932 15.2568L22 15V9C22 6.23858 19.7614 4 17 4H7ZM17 6C18.6569 6 20 7.34315 20 9V15L19.9961 15.1543C19.9158 16.7394 18.6051 18 17 18H12V6H17ZM10 18H7C5.34315 18 4 16.6569 4 15V9C4 7.34315 5.34315 6 7 6H10V18Z"
            fill={color}
            fill-opacity="0.6"
        />
    </AccessibleSVG>
);

export default IconRightSidebarChevronClose;
