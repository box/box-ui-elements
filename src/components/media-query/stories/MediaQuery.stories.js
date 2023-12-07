// @flow

import * as React from 'react';

import { VIEW_SIZE_TYPE } from '../constants';
import notes from './MediaQuery.stories.md';
import useMediaQuery from '../useMediaQuery';
import withMediaQuery from '../withMediaQuery';

export const CustomHook = () => {
    const { hover, isTouchDevice, pointer, size, viewWidth, viewHeight } = useMediaQuery();

    return (
        <div>
            <p>
                <b>Hover:</b>
                <span>{` ${hover}`}</span>
            </p>
            <p>
                <b>Pointer:</b>
                <span>{` ${pointer}`}</span>
            </p>
            <p>
                <b>Is Touch Device:</b>
                <span>{` ${String(isTouchDevice)}`}</span>
            </p>
            <p>
                <b>View Dimensions:</b>
                <span>{` ${viewWidth}px (w) x ${viewHeight}px (h)`}</span>
            </p>
            {size === VIEW_SIZE_TYPE.small && <h4>This view is small</h4>}
            {size === VIEW_SIZE_TYPE.medium && <h3>This view is medium</h3>}
            {size === VIEW_SIZE_TYPE.large && <h2>This view is large</h2>}
            {size === VIEW_SIZE_TYPE.xlarge && <h1>This view is xlarge</h1>}
        </div>
    );
};

type Props = {
    children?: any,
    hover: string,
    isTouchDevice: boolean,
    pointer: string,
    size: string,
    viewHeight: number,
    viewWidth: number,
};

const DemoComponent = (props: Props) => {
    const { hover, isTouchDevice, pointer, size, viewWidth, viewHeight } = props;

    return (
        <div>
            <p>
                <b>Hover:</b>
                <span>{` ${hover}`}</span>
            </p>
            <p>
                <b>Pointer:</b>
                <span>{` ${pointer}`}</span>
            </p>
            <p>
                <b>Is Touch Device:</b>
                <span>{` ${String(isTouchDevice)}`}</span>
            </p>
            <p>
                <b>View Dimensions:</b>
                <span>{` ${viewWidth}px (w) x ${viewHeight}px (h)`}</span>
            </p>
            {size === 'small' && <h4>This view is small</h4>}
            {size === 'medium' && <h3>This view is medium</h3>}
            {size === 'large' && <h2>This view is large</h2>}
            {size === 'x-large' && <h1>This view is xlarge</h1>}
        </div>
    );
};

export const HigherOrderComponent = withMediaQuery(DemoComponent);

export default {
    title: 'Components/MediaQuery',
    component: useMediaQuery,
    parameters: {
        notes,
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};
