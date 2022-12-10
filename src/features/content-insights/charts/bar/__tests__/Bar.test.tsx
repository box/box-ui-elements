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

        test('should render the label if provided', () => {
            const wrapper = getWrapper({ label: 'label' });
            const element = getFirstChild(wrapper);
            expect(element.querySelectorAll('.ca-Bar-label').length).toBe(1);
            expect(wrapper.queryByText('label')).toBeInTheDocument();
        });

        test('should not render the label if not provided', () => {
            const wrapper = getWrapper();
            const element = getFirstChild(wrapper);
            expect(element.querySelectorAll('.ca-Bar-label').length).toBe(0);
            expect(wrapper.queryByText('label')).not.toBeInTheDocument();
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

        test('should return the bar offset onMouseEnter', () => {
            const elementOffset = {
                left: 50,
                top: 20,
                width: 20,
            };

            jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(elementOffset as DOMRect);
            const onMouseEnter = jest.fn();
            const wrapper = getWrapper({ onMouseEnter });
            const element = getFirstChild(wrapper);

            fireEvent.mouseEnter(element);

            expect(onMouseEnter).toBeCalledWith({
                left: elementOffset.left + elementOffset.width / 2,
                top: elementOffset.top,
            });
        });

        test('should return default offset if ref is undefined', () => {
            jest.spyOn(React, 'useRef').mockImplementation(() => {
                return { current: null };
            });
            const elementOffset = {
                left: 0,
                top: 0,
            };
            const onMouseEnter = jest.fn();
            const wrapper = getWrapper({ onMouseEnter });
            const element = getFirstChild(wrapper);

            fireEvent.mouseEnter(element);

            expect(onMouseEnter).toBeCalledWith(elementOffset);
        });
    });
});
