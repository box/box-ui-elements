import * as React from 'react';

import Icon from '../../icons/general/IconCopy';
import * as vars from '../../styles/variables';

import PlainButton from './PlainButton';
import { ButtonType } from '../button';
import notes from './PlainButton.stories.md';

export const regular = () => (
    <PlainButton isDisabled={false} type={ButtonType.BUTTON}>
        Click Here
    </PlainButton>
);

export const disabled = () => <PlainButton isDisabled>Click Here</PlainButton>;

export const fixingMargins = () => (
    <>
        <div style={{ backgroundColor: vars.bdlLightBlue20, display: 'inline-block' }}>
            <PlainButton>
                <Icon />
            </PlainButton>
        </div>
        <p>By default the PlainButton component has margins set to 0.</p>

        <style>
            {`
                .bdl-SpecialButtonBug {
                    margin: 8px;
                }
            `}
        </style>
        <p style={{ backgroundColor: vars.bdlWatermelonRed10, display: 'inline-block' }}>
            <PlainButton className="bdl-SpecialButtonBug">
                <Icon />
            </PlainButton>
        </p>
        <p>
            The layout jumps on hover if margin overrides are not set for the :active and :hover states.
            <pre>
                <code>
                    {`
            .bdl-SpecialButtonBug {
                margin: $bdl-grid-unit*2;
            }
                `}
                </code>
            </pre>
        </p>
        <style>
            {`
                .bdl-SpecialButtonFix,
                .bdl-SpecialButtonFix:hover,
                .bdl-SpecialButtonFix:active {
                    margin: 8px;
                }
            `}
        </style>
        <p style={{ backgroundColor: vars.bdlGreenLight10, display: 'inline-block' }}>
            <PlainButton className="bdl-SpecialButtonFix">
                <Icon />
            </PlainButton>
        </p>
        <p>
            Workaround - use bdl-Button-margins mixin to define margins.
            <pre>
                <code>
                    {`
            .bdl-SpecialButtonFix {
                @include bdl-Button-margins($bdl-grid-unit*2);
            }
                `}
                </code>
            </pre>
        </p>
        <style>
            {`
                .bdl-SpecialButtonFix2,
                .bdl-SpecialButtonFix2:hover,
                .bdl-SpecialButtonFix2:active {
                    margin: 8px 12px 0 16px;
                }
            `}
        </style>
        <p style={{ backgroundColor: vars.bdlGreenLight10, display: 'inline-block' }}>
            <PlainButton className="bdl-SpecialButtonFix2">
                <Icon />
            </PlainButton>
        </p>
        <p>
            You can set all 4 margins inline using shorthand property syntax.
            <pre>
                <code>
                    {`
            .bdl-SpecialButtonFix2 {
                @include bdl-Button-margins($bdl-grid-unit*2 $bdl-grid-unit*3 0 $bdl-grid-unit*4);
            }
                `}
                </code>
            </pre>
        </p>
        <p>
            <b>Why not fix this?</b> We will eventually, but since this behavior is relied upon in many places it is a
            breaking change that needs to be rolled out strategically.
        </p>
    </>
);

export default {
    title: 'Components/Buttons/PlainButton',
    component: PlainButton,
    parameters: {
        notes,
    },
};
