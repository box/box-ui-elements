// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Pill from '../Pill';

export const pillProps = {
    isDisabled: false,
    isSelected: false,
    isValid: true,
    text: 'sample',
};

export const actions = {
    onRemove: action('onRemove'),
};

storiesOf('Pill', module).add('default', () => <Pill {...pillProps} {...actions} />);
