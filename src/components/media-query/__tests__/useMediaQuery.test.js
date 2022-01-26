// @flow

import React from 'react';
import { mount } from 'enzyme';
import useMediaQuery from '../useMediaQuery';

const WIDTH = 999;
const HEIGHT = 998;

type Props = {
    children?: React.node,
};

function FakeComponent(props: Props) {
    const mediaProps = useMediaQuery();

    return <div>{props.children(mediaProps)}</div>;
}

function setWindowProperty(prop, value) {
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
                {mediaProps => {
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
