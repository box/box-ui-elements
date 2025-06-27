import * as React from 'react';

import Button from '../button/Button';
import ButtonGroup from './ButtonGroup';
import notes from './ButtonGroup.stories.md';

export const regular = () => (
    <ButtonGroup>
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
    title: 'Components/Buttons/ButtonGroup',
    component: ButtonGroup,
    parameters: {
        notes,
    },
};
