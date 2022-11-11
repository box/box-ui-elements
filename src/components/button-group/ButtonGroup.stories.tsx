import * as React from 'react';

import Button from '../button/Button';
import ButtonGroup from './ButtonGroup';
import notes from './ButtonGroup.stories.md';

// eslint-disable-next-line react/prop-types
export const Base = ({ isDisabled }) => (
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
