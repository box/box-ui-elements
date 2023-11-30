import * as React from 'react';
import { select } from '@storybook/addon-knobs';
import Shield16 from '../../icon/line/Shield16';
import LabelPill, { LabelPillStatus, LabelPillSize } from './LabelPill';
import notes from './LabelPill.stories.md';

const typeLabel = '"type" Prop';
const sizeLabel = '"size" Prop';

const typeOptions: LabelPillStatus[] = [
    LabelPillStatus.DEFAULT,
    LabelPillStatus.ALERT,
    LabelPillStatus.ERROR,
    LabelPillStatus.FTUX,
    LabelPillStatus.HIGHLIGHT,
    LabelPillStatus.INFO,
    LabelPillStatus.SUCCESS,
    LabelPillStatus.WARNING,
];

const sizeOptions: LabelPillSize[] = [LabelPillSize.REGULAR, LabelPillSize.LARGE];

export const withText = () => (
    <LabelPill.Pill
        size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
        type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
    >
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const withIcon = () => (
    <LabelPill.Pill
        size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
        type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
    >
        <LabelPill.Icon Component={Shield16} />
    </LabelPill.Pill>
);

export const withBoth = () => (
    <LabelPill.Pill
        size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
        type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
    >
        <LabelPill.Icon Component={Shield16} />
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const severalComponents = () => (
    <div style={{ textAlign: 'center' }}>
        <LabelPill.Pill size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)} type={LabelPillStatus.WARNING}>
            <LabelPill.Text>BETA</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)} type={LabelPillStatus.INFO}>
            <LabelPill.Text>IN PROGRESS</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)} type={LabelPillStatus.WARNING}>
            <LabelPill.Icon Component={Shield16} />
            <LabelPill.Text>CONFIDENTIAL</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)} type={LabelPillStatus.FTUX}>
            <LabelPill.Text>NEW</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)} type={LabelPillStatus.ALERT}>
            <LabelPill.Text>DUE JUL 9 AT 11:59 PM</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)} type={LabelPillStatus.SUCCESS}>
            <LabelPill.Text>SUCCESS</LabelPill.Text>
        </LabelPill.Pill>{' '}
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
