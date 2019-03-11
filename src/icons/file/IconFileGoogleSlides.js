// @flow
import * as React from 'react';

import IconFileBase from './IconFileBase';
import type { Icon } from '../flowTypes';

const IconFileGoogleSlides = (props: Icon) => (
    <IconFileBase {...props} baseClassName="icon-file-google-slides">
        <path d="M25 27H7V5h13l5 5z" fill="#FFFFFF" />
        <path
            d="M20 4H7c-.6 0-1 .4-1 1v22c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V9.9L20 4zm5 23H7V5h13v4c0 .6.4 1 1 1h4v17z"
            fill="#F7BA00"
        />
        <path
            d="M10 14v9c0 .6.4 1 1 1h9c.6 0 1-.4 1-1v-9c0-.6-.4-1-1-1h-9c-.6 0-1 .4-1 1zm10 7h-9v-5h9v5z"
            fill="#F7BA00"
        />
    </IconFileBase>
);

export default IconFileGoogleSlides;
