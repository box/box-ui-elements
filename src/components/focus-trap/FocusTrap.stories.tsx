import * as React from 'react';

import Button from '../button';

// @ts-ignore JS import
import FocusTrap from './FocusTrap';
import notes from './FocusTrap.stories.md';

export const WithFocusableChildren = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <div>
            {isVisible && (
                <FocusTrap style={{ border: '1px solid black', padding: '20px' }}>
                    <p>
                        <a href="/#">focusable el</a>
                    </p>
                    <p>non-focusable el</p>
                    <p>
                        <a href="/#">focusable el</a>
                    </p>
                    <p>non-focusable el</p>
                    <Button onClick={() => setIsVisible(false)}>Close example and return focus</Button>
                </FocusTrap>
            )}
            <Button onClick={() => setIsVisible(true)}>Toggle example</Button>
        </div>
    );
};

export const WithoutFocusableChildren = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <div>
            {isVisible && (
                <FocusTrap style={{ border: '1px solid black', padding: '20px' }}>
                    <p>
                        non-focusable els, but focus is still trapped. For accessibility, there should always be a way
                        for the user to un-trap themselves using the keyboard (e.g. using the escape key).
                    </p>
                </FocusTrap>
            )}
            <Button onClick={() => setIsVisible(true)}>Toggle example</Button>
        </div>
    );
};

export default {
    title: 'Components|FocusTrap',
    component: FocusTrap,
    parameters: {
        notes,
    },
};
