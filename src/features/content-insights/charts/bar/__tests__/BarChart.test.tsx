import * as React from 'react';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import BarChart from '../BarChart';

describe('features/content-insights/charts/bar/BarChart', () => {
    const defaultAccessorsData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 10 },
    ];
    const horizontalAccessorsData = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 10, y: 3 },
    ];
    const zeroData = [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
    ];

    const getDefaultProps = (): {
        data: Array<{ x: number; y: number }>;
        label: string;
        labelAccessor: string;
        valueAccessor: string;
    } => ({
        data: defaultAccessorsData,
        label: 'Chart Label',
        labelAccessor: 'x',
        valueAccessor: 'y',
    });

    const getWrapper = (props = {}): RenderResult => {
        return render(<BarChart {...getDefaultProps()} {...props} />);
    };

    const getFirstChild = (wrapper: RenderResult): HTMLElement => wrapper.container.firstChild as HTMLElement;

    describe('render', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();
            const element = getFirstChild(wrapper);

            expect(element).toHaveClass('ca-BarChart');
            expect(element.getAttribute('aria-label')).toBe('Chart Label');
            expect(element.getAttribute('role')).toBe('img');
            expect(element.children.length).toBe(3);
            expect(element.children.item(0)?.querySelector('.ca-Bar-value')).toHaveStyle(`height: 20%`); // max value of the data is 10, since the first item is 2, 2/10 is 20%
        });

        test('should render horizontally if provided', () => {
            const wrapper = getWrapper({
                data: horizontalAccessorsData,
                direction: 'horizontal',
                labelAccessor: 'y',
                valueAccessor: 'x',
            });
            const element = getFirstChild(wrapper);

            expect(element).toHaveClass('is-horizontal');
            expect(element.children.length).toBe(3);
            expect(element.children.item(0)?.querySelector('.ca-Bar-value')).toHaveStyle(`width: 10%`); // max value of the data is 10, since the first item is 1, 1/10 is 10%
        });

        test('should use valueAccessor as a callback function if provided', () => {
            const data = [
                { x: 1, y: ['a', 'b'] },
                { x: 2, y: ['a', 'b', 'c', 'd'] },
                { x: 3, y: ['a'] },
            ];
            const valueAccessor = ({ y }: { y: Array<string> }) => y.length;
            const wrapper = getWrapper({ data, valueAccessor });
            const element = getFirstChild(wrapper);

            expect(element).toHaveClass('ca-BarChart');
            expect(element.getAttribute('aria-label')).toBe('Chart Label');
            expect(element.getAttribute('role')).toBe('img');
            expect(element.children.length).toBe(3);
            expect(element.children.item(0)?.querySelector('.ca-Bar-value')).toHaveStyle(`height: 50%`); // max value of the data is 4, since the first item is 2, 2/4 is 50%
        });

        test('should have all bars be minimum height if all values are zero', () => {
            const wrapper = getWrapper({ data: zeroData });
            const element = getFirstChild(wrapper);

            expect(element.children.length).toBe(3);
            expect(element.children.item(0)?.querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
            expect(element.children.item(1)?.querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
            expect(element.children.item(2)?.querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
        });

        test('should render with label', () => {
            const wrapper = getWrapper({ hasAxisLabel: true });
            const element = getFirstChild(wrapper);
            expect(element.querySelectorAll('.ca-Bar-label').length).toBe(3);
        });
    });

    describe('callbacks', () => {
        test('should call onBarMouseEnter with the data', () => {
            const onBarMouseEnter = jest.fn();
            const wrapper = getWrapper({ onBarMouseEnter });
            const element = getFirstChild(wrapper);

            fireEvent.mouseEnter(element.children.item(0) as HTMLElement);

            expect(onBarMouseEnter).toBeCalledWith({ datum: { x: 1, y: 2 } }, { left: 0, top: 0 });
        });

        test('should call onBarMouseLeave with the data', () => {
            const onBarMouseLeave = jest.fn();
            const wrapper = getWrapper({ onBarMouseLeave });
            const element = getFirstChild(wrapper);

            fireEvent.mouseLeave(element.children.item(0) as HTMLElement);

            expect(onBarMouseLeave).toBeCalledWith({ datum: { x: 1, y: 2 } });
        });
    });
});
