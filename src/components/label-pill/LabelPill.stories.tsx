import * as React from 'react';
import { select } from '@storybook/addon-knobs';
import ClockBadge16 from '../../icon/fill/ClockBadge16';
import LabelPill, { LabelPillStatus } from './LabelPill';
import notes from './LabelPill.stories.md';

const typeLabel = 'Pill Types';

const options: LabelPillStatus[] = [
    LabelPillStatus.DEFAULT,
    LabelPillStatus.ALERT,
    LabelPillStatus.ERROR,
    LabelPillStatus.HIGHLIGHT,
    LabelPillStatus.INFO,
    LabelPillStatus.SUCCESS,
    LabelPillStatus.WARNING,
];

export const withText = () => (
    <LabelPill.Pill type={select(typeLabel, options, LabelPillStatus.DEFAULT, 'g01')}>
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const withIcon = () => (
    <LabelPill.Pill type={select(typeLabel, options, LabelPillStatus.DEFAULT, 'g01')}>
        <LabelPill.Icon Component={ClockBadge16} />
    </LabelPill.Pill>
);

export const withBoth = () => (
    <LabelPill.Pill type={select(typeLabel, options, LabelPillStatus.DEFAULT, 'g01')}>
        <LabelPill.Icon Component={ClockBadge16} />
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const severalComponents = () => (
    <div style={{ textAlign: 'center' }}>
        <LabelPill.Pill type={select(typeLabel, options, LabelPillStatus.DEFAULT, 'g01')}>
            <LabelPill.Text>TEXT ONLY</LabelPill.Text>
        </LabelPill.Pill>
        <LabelPill.Pill type={select(typeLabel, options, LabelPillStatus.DEFAULT, 'g01')}>
            <LabelPill.Icon Component={ClockBadge16} />
        </LabelPill.Pill>
        <LabelPill.Pill type={select(typeLabel, options, LabelPillStatus.DEFAULT, 'g01')}>
            <LabelPill.Icon Component={ClockBadge16} />
            <LabelPill.Text>ICON AND TEXT</LabelPill.Text>
        </LabelPill.Pill>
    </div>
);

export default {
    title: 'Components|LabelPill',
    subcomponents: {
        'LabelPill.Pill': LabelPill.Pill,
        'LabelPill.Text': LabelPill.Text,
        'LabePill.Icon': LabelPill.Icon,
    },
    parameters: {
        notes,
    },
};
