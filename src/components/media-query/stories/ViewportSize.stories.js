// @flow

import * as React from 'react';

import notes from './ViewportSize.stories.md';
import useViewportSize from '../useViewportSize';
import withViewportSize from '../withViewportSize';

export const CustomHook = () => {
    const { viewWidth, viewHeight } = useViewportSize();

    return (
        <div>
            <p>
                <b>Viewport Dimensions:</b>
                <span>{` ${viewWidth}px (w) x ${viewHeight}px (h)`}</span>
            </p>
        </div>
    );
};

type Props = {
    viewHeight: number,
    viewWidth: number,
};

const DemoComponent = (props: Props) => {
    const { viewWidth, viewHeight } = props;

    return (
        <div>
            <p>
                <b>Viewport Dimensions:</b>
                <span>{` ${viewWidth}px (w) x ${viewHeight}px (h)`}</span>
            </p>
        </div>
    );
};

export const HigherOrderComponent = withViewportSize(DemoComponent);

export default {
    title: 'Components|ViewportSize',
    component: useViewportSize,
    parameters: {
        notes,
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};
