// @flow

import React from 'react';
import { mount } from 'enzyme';
import { useViewportSize } from '../useViewportSize';

const mockWIDTH = 999;
const mockHEIGHT = 998;

jest.mock('../util', () => {
    return {
        getClientDimensions: jest.fn(() => ({
            viewWidth: mockWIDTH,
            viewHeight: mockHEIGHT,
        })),
    };
});

type Props = {
    children?: React.node,
};

function FakeComponent(props: Props) {
    const viewportProps = useViewportSize();

    return <div>{props.children(viewportProps)}</div>;
}

describe('components/media-query/useViewportSize', () => {
    test('returns correct viewport width and height', () => {
        const mountedComponent = mount(
            <FakeComponent>
                {viewportProps => {
                    return (
                        <div>
                            <div className="width">{viewportProps.viewWidth}</div>
                            <div className="height">{viewportProps.viewHeight}</div>
                        </div>
                    );
                }}
            </FakeComponent>,
        );

        expect(mountedComponent.find('.width').text()).toBe(`${mockWIDTH}`);
        expect(mountedComponent.find('.height').text()).toBe(`${mockHEIGHT}`);
    });
});
