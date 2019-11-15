import React from 'react';
import { Reference, Popper } from 'react-popper';
import PopperComponent from '..';

describe('components/popper/PopperComponent', () => {
    test('should throw an error if not enough children provided', () => {
        expect(() => {
            shallow(
                <PopperComponent>
                    <div>Reference element</div>
                </PopperComponent>,
            );
        }).toThrow();
    });

    test('should not render popper content if not open', () => {
        const wrapper = shallow(
            <PopperComponent>
                <div>Reference element</div>
                <div>Popper content</div>
            </PopperComponent>,
        );

        expect(wrapper.exists(Reference)).toBe(true);
        expect(wrapper.exists(Popper)).toBe(false);
    });

    test('should render popper content if is open', () => {
        const wrapper = shallow(
            <PopperComponent isOpen>
                <div>Reference element</div>
                <div>Popper content</div>
            </PopperComponent>,
        );

        expect(wrapper.exists(Reference)).toBe(true);
        expect(wrapper.exists(Popper)).toBe(true);
    });

    test('should apply the placement to the Popper', () => {
        const wrapper = shallow(
            <PopperComponent isOpen placement="bottom-end">
                <div>Reference element</div>
                <div>Popper content</div>
            </PopperComponent>,
        );

        expect(wrapper.exists(Reference)).toBe(true);
        const popperWrapper = wrapper.find(Popper);
        expect(popperWrapper.length).toBe(1);
        expect(popperWrapper.prop('placement')).toBe('bottom-end');
    });
});
