import * as React from 'react';
import { select } from '@storybook/addon-knobs';

import Button from '../button';
import IconHelp from '../../icons/general/IconHelp';
// @ts-ignore JS import
import TextInput from '../text-input';
import PlainButton from '../plain-button';
import PrimaryButton from '../primary-button';
// @ts-ignore JS import
import TextArea from '../text-area';

// @ts-ignore JS import
import { Flyout, Overlay } from '.';
import notes from './Flyout.stories.md';

export const Basic = () => {
    const positions = {
        'bottom-center': 'bottom-center',
        'bottom-left': 'bottom-left',
        'bottom-right': 'bottom-right',
        'middle-left': 'middle-left',
        'middle-right': 'middle-right',
        'top-center': 'top-left',
        'top-left': 'top-left',
        'top-right': 'top-right',
    };

    const position = select('Position', positions, 'bottom-center');

    return (
        <div style={{ marginTop: 200, marginLeft: 200 }}>
            <Flyout closeOnClickOutside={false} position={position}>
                <Button>Nothing to see here</Button>
                <Overlay>
                    <div className="accessible-overlay-content">
                        <p>Try hitting the Tab key.</p>
                        <p>Now try click outside, go ahead.</p>
                        <br />
                        <p>
                            <i>You are not going anywhere.</i>
                        </p>
                    </div>
                </Overlay>
            </Flyout>
        </div>
    );
};

export const OpenOnHover = () => {
    return (
        <div style={{ marginTop: 200, marginLeft: 200 }}>
            <Flyout openOnHover>
                <Button>Open on Hover</Button>
                <Overlay>
                    <div className="accessible-overlay-content">
                        <h1>Some text</h1>
                        <p>Some more text</p>
                        <br />
                        <a href="https://google.com">Go to Google?</a>
                    </div>
                </Overlay>
            </Flyout>
        </div>
    );
};

export const Complex = () => {
    return (
        <div style={{ marginTop: 200, marginLeft: 200 }}>
            <Flyout className="amsterdam-survey-overlay" offset="0 0">
                <PlainButton className="amsterdam-survey-button">
                    <IconHelp />
                </PlainButton>
                <Overlay>
                    <div>
                        <TextArea name="textarea" label="Provide Feedback" />
                    </div>
                    <div>
                        <TextInput name="email" label="Email Address" placeholder="user@example.com" type="email" />
                    </div>
                    <div className="icon-menu-container">
                        <PrimaryButton>Submit</PrimaryButton>
                        <Button>Close</Button>
                    </div>
                </Overlay>
            </Flyout>
        </div>
    );
};

export default {
    title: 'Components|Flyout',
    component: Flyout,
    parameters: {
        notes,
    },
};
