import * as React from 'react';
import { mount } from 'enzyme';

import useMediaQuery from '../useMediaQuery';
import type { MediaShape } from '../types';

const WIDTH = 999;
const HEIGHT = 998;

interface FakeComponentProps {
    children: (mediaProps: MediaShape) => React.ReactNode;
}

function FakeComponent(props: FakeComponentProps) {
    const mediaProps = useMediaQuery();

    return <div>{props.children(mediaProps)}</div>;
}

function setWindowProperty(prop: 'innerHeight' | 'innerWidth', value: number) {
    Object.defineProperty(window, prop, {
        writable: true,
        value,
    });
}

describe('components/media-query/useMediaQuery', () => {
    test('returns correct view width and height', () => {
        setWindowProperty('innerWidth', WIDTH);
        setWindowProperty('innerHeight', HEIGHT);

        const mountedComponent = mount(
            <FakeComponent>
                {(mediaProps: MediaShape) => {
                    return (
                        <div>
                            <div className="height">{mediaProps.viewHeight}</div>
                            <div className="width">{mediaProps.viewWidth}</div>
                        </div>
                    );
                }}
            </FakeComponent>,
        );

        expect(mountedComponent.find('.height').text()).toBe(`${HEIGHT}`);
        expect(mountedComponent.find('.width').text()).toBe(`${WIDTH}`);
    });
});
