import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import { bdlGray20, bdlPurpleRain } from '../../../styles/variables';
import RadioButton, { RadioButtonProps } from '../RadioButton';

import RadioGroup from '../RadioGroup';
import notes from './RadioGroup.stories.md';

export const basic = () => (
    <RadioGroup name="radiogroup" value="radio3">
        <RadioButton label="Radio Button 1" value="radio1" description="I have a description" />
        <RadioButton label="Radio Button 2" value="radio2" description="I also have a description" />
        <RadioButton label="Radio Button 3" value="radio3" />
        <RadioButton label="Radio Button 4" value="radio4" />
        <RadioButton label="Disabled Radio Button" value="radio5" isDisabled={boolean('isDisabled', true)} />
    </RadioGroup>
);

export const withCustomRadioButtonComponent = () => {
    const CustomRadioButton = ({ isSelected, name, value }: RadioButtonProps) => (
        <span style={{ marginRight: '8px', position: 'relative' }}>
            <input
                checked={isSelected}
                name={name}
                type="radio"
                value={value}
                style={{ height: '20px', opacity: 0, width: '20px' }}
            />
            <span
                style={{
                    backgroundColor: isSelected ? bdlPurpleRain : bdlGray20,
                    borderRadius: '50%',
                    display: 'inline-block',
                    height: '20px',
                    left: '0px',
                    position: 'absolute',
                    width: '20px',
                    zIndex: -1,
                }}
            />
        </span>
    );

    return (
        <RadioGroup name="customradiogroup" value="customRadio3">
            <CustomRadioButton label="Radio Button 1" value="customRadio1" />
            <CustomRadioButton label="Radio Button 2" value="customRadio2" />
            <CustomRadioButton label="Radio Button 3" value="customRadio3" />
            <CustomRadioButton label="Radio Button 4" value="customRadio4" />
            <CustomRadioButton label="Radio Button 5" value="customRadio5" />
        </RadioGroup>
    );
};

export default {
    title: 'Components|Radio/RadioGroup',
    component: RadioGroup,
    parameters: {
        notes,
    },
};
