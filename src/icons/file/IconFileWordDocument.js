// @flow
import * as React from 'react';

import IconFileBase from './IconFileBase';
import type { Icon } from '../flowTypes';

const IconFileWordDocument = (props: Icon) => (
    <IconFileBase {...props} baseClassName="icon-file-word-document">
        <path d="M25 27H7V5h13l5 5z" fill="#FFFFFF" />
        <path
            d="M20 4H7c-.6 0-1 .4-1 1v22c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V9.9L20 4zm5 23H7V5h13v4c0 .6.4 1 1 1h4v17z"
            fill="#2A5696"
        />
        <path d="M10 13h11v1H10zm0 2h11v1H10zm0 2h11v1H10zm0 2h11v1H10zm0 2h11v1H10z" fill="#2A5696" />
    </IconFileBase>
);

export default IconFileWordDocument;
