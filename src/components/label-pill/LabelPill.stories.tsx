import * as React from 'react';
import { select } from '@storybook/addon-knobs';
import ClockBadge16 from '../../icon/fill/ClockBadge16';
import LabelPill, { LabelPillStatus, LabelPillSize } from './LabelPill';
import notes from './LabelPill.stories.md';

const typeLabel = '"type" Prop';
const sizeLabel = '"size" Prop';

const typeOptions: LabelPillStatus[] = [
    LabelPillStatus.DEFAULT,
    LabelPillStatus.ALERT,
    LabelPillStatus.ERROR,
    LabelPillStatus.HIGHLIGHT,
    LabelPillStatus.INFO,
    LabelPillStatus.SUCCESS,
    LabelPillStatus.WARNING,
];

const sizeOptions: LabelPillSize[] = [LabelPillSize.REGULAR, LabelPillSize.LARGE];

export const withText = () => (
    <LabelPill.Pill
        type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
        size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
    >
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const withIcon = () => (
    <LabelPill.Pill
        type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
        size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
    >
        <LabelPill.Icon Component={ClockBadge16} />
    </LabelPill.Pill>
);

export const withBoth = () => (
    <LabelPill.Pill
        type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
        size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
    >
        <LabelPill.Icon Component={ClockBadge16} />
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const severalComponents = () => (
    <div style={{ textAlign: 'center' }}>
        <LabelPill.Pill
            type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
            size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
        >
            <LabelPill.Text>TEXT ONLY</LabelPill.Text>
        </LabelPill.Pill>
        <LabelPill.Pill
            type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
            size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
        >
            <LabelPill.Icon Component={ClockBadge16} />
        </LabelPill.Pill>
        <LabelPill.Pill
            type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
            size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
        >
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
