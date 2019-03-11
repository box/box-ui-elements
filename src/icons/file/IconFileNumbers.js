// @flow
import * as React from 'react';

import IconFileBase from './IconFileBase';
import type { Icon } from '../flowTypes';

const IconFileNumbers = (props: Icon) => (
    <IconFileBase {...props} baseClassName="icon-file-numbers">
        <path d="M25 27H7V5h13l5 5z" fill="#FFFFFF" />
        <path
            d="M20 4H7c-.6 0-1 .4-1 1v22c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V9.9L20 4zm5 23H7V5h13v4c0 .6.4 1 1 1h4v17z"
            fill="#2ABB80"
        />
        <path
            d="M21.5 23.5h-12c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h12c.3 0 .5.2.5.5s-.2.5-.5.5zm0-2H20c-.3 0-.5-.2-.5-.5v-6c0-.3.2-.5.5-.5h1.5c.3 0 .5.2.5.5v6c0 .3-.2.5-.5.5zm-3.5 0h-1.5c-.3 0-.5-.2-.5-.5v-8.5c0-.3.2-.4.5-.4H18c.3 0 .5.1.5.4V21c0 .3-.2.5-.5.5zm-3.5 0H13c-.3 0-.5-.2-.5-.5v-4.5c0-.3.2-.5.5-.5h1.5c.3 0 .5.2.5.5V21c0 .3-.2.5-.5.5zm-3.5 0H9.5c-.3 0-.5-.2-.5-.5v-1.5c0-.3.2-.5.5-.5H11c.3 0 .5.2.5.5V21c0 .3-.2.5-.5.5z"
            fill="#2ABB80"
        />
    </IconFileBase>
);

export default IconFileNumbers;
