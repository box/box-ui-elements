// @flow
import * as React from 'react';

import IconFileBase from './IconFileBase';
import type { Icon } from '../flowTypes';

const IconFileVector = (props: Icon) => (
    <IconFileBase {...props} baseClassName="icon-file-vector">
        <path d="M25 27H7V5h13l5 5v17z" fill="#fff" />
        <path
            d="M20 4H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9.89zm5 23H7V5h13v4a1 1 0 0 0 1 1h4z"
            fill="#f8931d"
        />
        <path d="M20.34 20.25a5 5 0 0 0-9.68 0 1 1 0 1 1-1-.19 6 6 0 0 1 11.65 0 1 1 0 1 1-1 .19z" fill="#f7931d" />
        <circle cx="15.5" cy="15.5" fill="#fff" r="2.79" />
        <path d="M15.5 16.5a1 1 0 1 0-1-1 1 1 0 0 0 1 1zm0 1a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" fill="#f8931d" />
        <path d="M17 15h5v1h-5zM9 15h5v1H9z" fill="#f8931d" />
    </IconFileBase>
);

export default IconFileVector;
