import * as React from 'react';

import Button from '../button/Button';
import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';
import notes from './ButtonGroup.stories.md';

export const Base = ({ isDisabled }: ButtonGroupProps) => (
    <ButtonGroup isDisabled={isDisabled}>
        <Button>Add</Button>
        <Button>Update</Button>
        <Button>Remove</Button>
    </ButtonGroup>
);

export default {
    title: 'Components|Buttons/ButtonGroup',
    component: ButtonGroup,
    parameters: {
        notes,
    },
    argTypes: {
        isDisabled: false,
    },
};
