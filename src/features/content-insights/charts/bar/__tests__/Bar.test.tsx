import React from 'react';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import Bar from '../Bar';

describe('features/content-insights/charts/bar/Bar', () => {
    const getDefaultProps = () => ({
        size: 80,
    });
    const getWrapper = (props = {}) => {
        return render(<Bar {...getDefaultProps()} {...props} />);
    };
    const getFirstChild = (wrapper: RenderResult): HTMLElement => wrapper.container.firstChild as HTMLElement;

    describe('render', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();
            const element = getFirstChild(wrapper);

            expect(element).toHaveClass('ca-Bar');
            expect(element.querySelector('.ca-Bar-value')).toHaveStyle(`height: 80%`);
        });

        test('should render a minimum bar if value is 0', () => {
            const wrapper = getWrapper({ size: 0 });
            const element = getFirstChild(wrapper);

            expect(element.querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
        });

        test('should render a minimum bar if value is < 0', () => {
            const wrapper = getWrapper({ size: -5 });
            const element = getFirstChild(wrapper);

            expect(element.querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
        });

        test('should render a color if provided', () => {
            const wrapper = getWrapper({ color: 'blue' });
            const element = getFirstChild(wrapper);

            expect(element.querySelector('.ca-Bar-value')).toHaveStyle(`background-color: blue`);
        });

        test('should render horizontally if provided', () => {
            const wrapper = getWrapper({ direction: 'horizontal' });
            const element = getFirstChild(wrapper);

            expect(element).toHaveClass('is-horizontal');
            expect(element.querySelector('.ca-Bar-value')).toHaveStyle(`width: 80%`);
        });
    });

    describe('callbacks', () => {
        test('should call onMouseEnter', () => {
            const onMouseEnter = jest.fn();
            const wrapper = getWrapper({ onMouseEnter });
            const element = getFirstChild(wrapper);

            fireEvent.mouseEnter(element);

            expect(onMouseEnter).toBeCalled();
        });

        test('should call onMouseLeave', () => {
            const onMouseLeave = jest.fn();
            const wrapper = getWrapper({ onMouseLeave });
            const element = getFirstChild(wrapper);

            fireEvent.mouseLeave(element);

            expect(onMouseLeave).toBeCalled();
        });
    });
});
