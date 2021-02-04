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
        <LabelPill.Icon Component={Shield16} />
    </LabelPill.Pill>
);

export const withBoth = () => (
    <LabelPill.Pill
        type={select(typeLabel, typeOptions, LabelPillStatus.DEFAULT)}
        size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}
    >
        <LabelPill.Icon Component={Shield16} />
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const severalComponents = () => (
    <div style={{ textAlign: 'center' }}>
        <LabelPill.Pill type={LabelPillStatus.WARNING} size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}>
            <LabelPill.Text>BETA</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.INFO} size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}>
            <LabelPill.Text>IN PROGRESS</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.WARNING} size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}>
            <LabelPill.Icon Component={Shield16} />
            <LabelPill.Text>CONFIDENTIAL</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.ALERT} size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}>
            <LabelPill.Text>DUE JUL 9 AT 11:59 PM</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.SUCCESS} size={select(sizeLabel, sizeOptions, LabelPillSize.REGULAR)}>
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
