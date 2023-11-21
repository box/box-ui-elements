import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import { bdlGray20, bdlPurpleRain } from '../../../styles/variables';
import RadioButton, { RadioButtonProps } from '../RadioButton';
import RadioGroup from '../RadioGroup';
import notes from './RadioGroup.stories.md';

export const basic = () => (
    <RadioGroup name="radiogroup" value="radio3">
        <RadioButton description="I have a description" label="Radio Button 1" value="radio1" />
        <RadioButton description="I also have a description" label="Radio Button 2" value="radio2" />
        <RadioButton label="Radio Button 3" value="radio3" />
        <RadioButton label="Radio Button 4" value="radio4" />
        <RadioButton isDisabled={boolean('isDisabled', true)} label="Disabled Radio Button" value="radio5" />
    </RadioGroup>
);

export const withCustomRadioButtonComponent = () => {
    const CustomRadioButton = ({ isSelected, label, name, value }: RadioButtonProps) => (
        <span style={{ marginRight: '15px', position: 'relative' }} title={String(label)}>
            <span
                style={{
                    backgroundColor: isSelected ? bdlPurpleRain : bdlGray20,
                    borderRadius: '50%',
                    display: 'inline-block',
                    height: '20px',
                    left: '0',
                    position: 'absolute',
                    width: '20px',
                }}
            />
            <input
                checked={isSelected}
                name={name}
                style={{ cursor: 'pointer', height: '20px', opacity: 0, width: '20px' }}
                type="radio"
                value={value}
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
