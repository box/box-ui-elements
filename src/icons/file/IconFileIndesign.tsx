import * as React from 'react';

import IconFileBase from './IconFileBase';
import { Icon } from '../iconTypes';

const IconFileIndesign = (props: Icon) => (
    <IconFileBase {...props} baseClassName="icon-file-indesign">
        <path d="M25 27H7V5h13l5 5v17z" fill="#fff" />
        <path
            d="M20 4H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9.89zm5 23H7V5h13v4a1 1 0 0 0 1 1h4z"
            fill="#955ca5"
        />
        <path
            d="M15.64 14.45v5.32h1.44a2.32 2.32 0 0 0 2.44-2.19v-.48-.35a2.34 2.34 0 0 0-2.44-2.3zm-.87-.77h2.36c2 0 3.24 1.27 3.24 3.43s-1.21 3.41-3.24 3.41h-2.35zm-1.92 6.83v-6.83H12v6.83z"
            fill="#955ca5"
        />
    </IconFileBase>
);

export default IconFileIndesign;
