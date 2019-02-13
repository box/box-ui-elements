// @flow
import * as React from 'react';

import IconFileBase from './IconFileBase';
import type { Icon } from '../flowTypes';

const IconFilePresentation = (props: Icon) => (
    <IconFileBase {...props} baseClassName="icon-file-presentation">
        <path d="M25 27H7V5h13l5 5v17z" fill="#fff" />
        <path
            d="M20 4H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9.89zm5 23H7V5h13v4a1 1 0 0 0 1 1h4z"
            fill="#f7931d"
        />
        <path
            d="M10.35 22.41l-.7-.71 4.88-4.86 2.49 2.47 4.63-4.61.7.71-5.33 5.32-2.49-2.48-4.18 4.16z"
            fill="#f7931d"
        />
    </IconFileBase>
);

export default IconFilePresentation;
