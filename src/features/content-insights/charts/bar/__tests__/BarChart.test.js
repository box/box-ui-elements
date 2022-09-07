import React from 'react';
import { fireEvent, render } from '@testing-library/react';
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

    const getDefaultProps = () => ({
        data: defaultAccessorsData,
        label: 'Chart Label',
        labelAccessor: 'x',
        valueAccessor: 'y',
    });

    const getWrapper = props => {
        return render(<BarChart {...getDefaultProps()} {...props} />);
    };

    describe('render', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();
            const element = wrapper.container.firstChild;

            expect(element).toHaveClass('ca-BarChart');
            expect(element.getAttribute('aria-label')).toBe('Chart Label');
            expect(element.getAttribute('role')).toBe('img');
            expect(element.children.length).toBe(3);
            expect(element.children.item(0).querySelector('.ca-Bar-value')).toHaveStyle(`height: 20%`); // max value of the data is 10, since the first item is 2, 2/10 is 20%
        });

        test('should render horizontally if provided', () => {
            const wrapper = getWrapper({
                data: horizontalAccessorsData,
                direction: 'horizontal',
                labelAccessor: 'y',
                valueAccessor: 'x',
            });
            const element = wrapper.container.firstChild;

            expect(element).toHaveClass('is-horizontal');
            expect(element.children.length).toBe(3);
            expect(element.children.item(0).querySelector('.ca-Bar-value')).toHaveStyle(`width: 10%`); // max value of the data is 10, since the first item is 1, 1/10 is 10%
        });

        test('should use valueAccessor as function if provided', () => {
            const data = [
                { x: 1, y: ['a', 'b'] },
                { x: 2, y: ['a', 'b', 'c', 'd'] },
                { x: 3, y: ['a'] },
            ];
            const valueAccessor = ({ y }) => y.length;
            const wrapper = getWrapper({ data, valueAccessor });
            const element = wrapper.container.firstChild;

            expect(element).toHaveClass('ca-BarChart');
            expect(element.getAttribute('aria-label')).toBe('Chart Label');
            expect(element.getAttribute('role')).toBe('img');
            expect(element.children.length).toBe(3);
            expect(element.children.item(0).querySelector('.ca-Bar-value')).toHaveStyle(`height: 50%`); // max value of the data is 4, since the first item is 2, 2/4 is 50%
        });

        test('should have all bars be minimum height if all values are zero', () => {
            const wrapper = getWrapper({ data: zeroData });
            const element = wrapper.container.firstChild;

            expect(element.children.length).toBe(3);
            expect(element.children.item(0).querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
            expect(element.children.item(1).querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
            expect(element.children.item(2).querySelector('.ca-Bar-value')).toHaveStyle(`height: 2px`);
        });
    });

    describe('callbacks', () => {
        test('should call onBarMouseEnter with the data', () => {
            const onBarMouseEnter = jest.fn();
            const wrapper = getWrapper({ onBarMouseEnter });
            const element = wrapper.container.firstChild;

            fireEvent.mouseEnter(element.children.item(0));

            expect(onBarMouseEnter).toBeCalledWith({ datum: { x: 1, y: 2 } });
        });

        test('should call onBarMouseLeave with the data', () => {
            const onBarMouseLeave = jest.fn();
            const wrapper = getWrapper({ onBarMouseLeave });
            const element = wrapper.container.firstChild;

            fireEvent.mouseLeave(element.children.item(0));

            expect(onBarMouseLeave).toBeCalledWith({ datum: { x: 1, y: 2 } });
        });
    });
});
