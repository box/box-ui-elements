import * as React from 'react';

import { bdlBoxBlue } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';

import { Icon } from '../iconTypes';

const CollaborationBadge = ({ className = '', color = bdlBoxBlue, height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={`collaboration-badge ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <g fill="none" fillRule="evenodd">
            <path
                className="fill-color"
                d="M0 8c0 .62.07 1.23.21 1.824C.47 10.95.975 12 1.682 12.91c.792 1.017 1.82 1.832 2.994 2.37C5.71 15.75 6.837 16 8 16c4.418 0 8-3.582 8-8 0-.26-.21-.47-.47-.47s-.47.21-.47.47c0 3.898-3.162 7.06-7.06 7.06-1.026 0-2.02-.22-2.932-.637-1.035-.473-1.943-1.193-2.642-2.092-.624-.8-1.07-1.727-1.3-2.72C1.003 9.087.94 8.548.94 8 .94 4.102 4.103.94 8 .94c.26 0 .47-.21.47-.47S8.26 0 8 0C3.582 0 0 3.582 0 8z"
                fill={color}
            />
            <path
                className="fill-color"
                d="M9 6c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zM6 6c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM5.59 11.014c.63-.32 1.354-.514 2.16-.514s1.53.193 2.16.514c.374.19.63.376.75.488.2.188.517.177.706-.024.188-.202.177-.52-.025-.707-.183-.17-.512-.41-.976-.647C9.6 9.733 8.724 9.5 7.75 9.5c-.973 0-1.85.233-2.614.623-.464.236-.793.476-.977.648-.203.19-.214.506-.026.708.19.2.505.212.707.024.12-.112.376-.298.75-.488zM14 2V.498C14 .215 13.776 0 13.5 0c-.268 0-.5.223-.5.498V2h-1.502c-.283 0-.498.224-.498.5 0 .268.223.5.498.5H13v1.502c0 .283.224.498.5.498.268 0 .5-.223.5-.498V3h1.502c.283 0 .498-.224.498-.5 0-.268-.223-.5-.498-.5H14z"
                fill={color}
            />
        </g>
    </AccessibleSVG>
);

export default CollaborationBadge;
