// @flow
import * as React from 'react';

import Badge from './Badge';
import notes from './Badge.stories.md';

export const regular = () => <Badge>Default Badge</Badge>;

export const info = () => <Badge type="info">Info Badge</Badge>;

export const warning = () => <Badge type="warning">Warning Badge</Badge>;

export const highlight = () => <Badge type="highlight">Highlight Badge</Badge>;

export const error = () => <Badge type="error">Error Badge</Badge>;

export const alert = () => <Badge type="alert">Alert Badge</Badge>;

export const success = () => <Badge type="success">Success Badge</Badge>;

export default {
    title: 'Components|Badge',
    component: Badge,
    parameters: {
        notes,
    },
};
