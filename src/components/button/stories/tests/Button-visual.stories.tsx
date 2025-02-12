import React from 'react';
import IconAdd from '../../../../icons/general/IconAdd';
import ButtonAdapter from '../../ButtonAdapter';
import { ButtonType } from '../../Button';

export const visualRegressionTests = () => (
    <div className="button-visual-test">
        {/* Default state */}
        <ButtonAdapter type={ButtonType.BUTTON}>Default Button</ButtonAdapter>

        {/* Hover state - Note: Hover state will be tested via Chromatic's hover capability */}
        <ButtonAdapter type={ButtonType.BUTTON}>Hover Button</ButtonAdapter>

        {/* Active state */}
        <ButtonAdapter type={ButtonType.BUTTON} className="is-active">
            Active Button
        </ButtonAdapter>

        {/* Disabled state */}
        <ButtonAdapter type={ButtonType.BUTTON} isDisabled>
            Disabled Button
        </ButtonAdapter>

        {/* Loading state */}
        <ButtonAdapter type={ButtonType.BUTTON} isLoading>
            Loading Button
        </ButtonAdapter>

        {/* Selected state */}
        <ButtonAdapter type={ButtonType.BUTTON} isSelected>
            Selected Button
        </ButtonAdapter>

        {/* With icon */}
        <ButtonAdapter type={ButtonType.BUTTON}>
            <IconAdd />
        </ButtonAdapter>

        {/* With text */}
        <ButtonAdapter type={ButtonType.BUTTON}>Text Only</ButtonAdapter>

        {/* With icon and text */}
        <ButtonAdapter type={ButtonType.BUTTON}>
            <IconAdd />
            Icon with Text
        </ButtonAdapter>

        {/* Large size variant */}
        <ButtonAdapter type={ButtonType.BUTTON} size="large">
            Large Button
        </ButtonAdapter>

        {/* With radar animation */}
        <ButtonAdapter type={ButtonType.BUTTON} showRadar>
            Radar Button
        </ButtonAdapter>
    </div>
);

export default {
    title: 'Components/Button/Visual Tests',
};
