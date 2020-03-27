import * as React from 'react';

import RadioButton from '../radio/RadioButton';
import RadioGroup from '../radio/RadioGroup';

import Fieldset from './Fieldset';
import notes from './Fieldset.stories.md';

export const basic = () => (
    <Fieldset title="Choose your favorite dessert">
        <RadioGroup name="nodeType" value="cupcakes">
            <RadioButton label="Apple Pie" value="applePie" />
            <RadioButton label="Cheesecake" value="cheesecake" />
            <RadioButton label="Cupcakes" value="cupcakes" />
            <RadioButton label="Macarons" value="macarons" />
            <RadioButton label="Tiramisu" value="tiramisu" />
        </RadioGroup>
    </Fieldset>
);

export default {
    title: 'Components|Fieldset',
    component: Fieldset,
    parameters: {
        notes,
    },
};
