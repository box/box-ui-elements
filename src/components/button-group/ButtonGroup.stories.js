// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

// $FlowFixMe migrated to TS
import Button from '../button/Button'; // eslint-disable-line
import ButtonGroup from './ButtonGroup';
import notes from './ButtonGroup.stories.md';

export const regular = () => (
    <ButtonGroup isDisabled={boolean('isDisabled', false)}>
        <Button>Add</Button>
        <Button>Update</Button>
        <Button>Remove</Button>
    </ButtonGroup>
);

export const disabled = () => (
    <ButtonGroup isDisabled>
        <Button>Add</Button>
        <Button>Update</Button>
        <Button>Remove</Button>
    </ButtonGroup>
);

export default {
    title: 'Components|ButtonGroup',
    component: ButtonGroup,
    parameters: {
        notes,
    },
};
