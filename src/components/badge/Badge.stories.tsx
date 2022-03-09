import * as React from 'react';

import Badge from './Badge';
import notes from './Badge.stories.md';
import { BadgeType } from './types';

export const regular = () => <Badge>Default Badge</Badge>;

export const info = () => <Badge type={BadgeType.INFO}>Info Badge</Badge>;

export const warning = () => <Badge type={BadgeType.WARNING}>Warning Badge</Badge>;

export const highlight = () => <Badge type={BadgeType.HIGHLIGHT}>Highlight Badge</Badge>;

export const error = () => <Badge type={BadgeType.ERROR}>Error Badge</Badge>;

export const alert = () => <Badge type={BadgeType.ALERT}>Alert Badge</Badge>;

export const success = () => <Badge type={BadgeType.SUCCESS}>Success Badge</Badge>;

export default {
    title: 'Components|Badges/Badge',
    component: Badge,
    parameters: {
        notes,
    },
};
