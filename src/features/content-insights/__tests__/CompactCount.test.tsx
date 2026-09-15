import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import CompactCount from '../CompactCount';

jest.mock('@box/blueprint-web', () => ({
    Text: ({
        as: Component = 'p',
        children,
        color,
        variant,
        ...rest
    }: React.ComponentPropsWithoutRef<'span'> & { as?: React.ElementType; color?: string; variant?: string }) => (
        <Component data-color={color} data-variant={variant} {...rest}>
            {children}
        </Component>
    ),
}));

describe('features/content-insights/CompactCount', () => {
    const getWrapper = (props = {}) => render(<CompactCount count={0} {...props} />);

    describe('render()', () => {
        test('should apply a provided classname', () => {
            const wrapper = getWrapper({ className: 'foo' });

            expect(wrapper.container.firstChild).toHaveClass('foo');
        });

        test.each`
            count   | expectedCount
            ${0}    | ${'0'}
            ${1}    | ${'1'}
            ${1000} | ${'1,000'}
        `('should display the count $count as $expectedCount', ({ count, expectedCount }) => {
            const wrapper = getWrapper({ count });

            expect(wrapper.getByText(expectedCount)).toBeVisible();
        });

        test.each`
            count      | expectedCount
            ${10000}   | ${'10K'}
            ${11123}   | ${'11K'}
            ${100123}  | ${'100K'}
            ${1000000} | ${'1M'}
            ${2000123} | ${'2M'}
        `('should display the count $count as $expectedCount', ({ count, expectedCount }) => {
            const wrapper = getWrapper({ count });

            expect(wrapper.getByText(expectedCount)).toBeVisible();
        });

        test('should render captionBold Text by default when isRedesignEnabled', () => {
            getWrapper({ count: 3, isRedesignEnabled: true });

            expect(screen.getByText('3')).toHaveAttribute('data-variant', 'captionBold');
        });

        test('should render the provided Text variant when isRedesignEnabled', () => {
            getWrapper({ count: 3, isRedesignEnabled: true, variant: 'bodyLargeBold' });

            expect(screen.getByText('3')).toHaveAttribute('data-variant', 'bodyLargeBold');
        });

        test('should render textOnLightSecondary by default when isRedesignEnabled', () => {
            getWrapper({ count: 3, isRedesignEnabled: true });

            expect(screen.getByText('3')).toHaveAttribute('data-color', 'textOnLightSecondary');
        });

        test('should render the provided Text color when isRedesignEnabled', () => {
            getWrapper({ color: 'textOnLightDefault', count: 3, isRedesignEnabled: true });

            expect(screen.getByText('3')).toHaveAttribute('data-color', 'textOnLightDefault');
        });

        test('should call mouseenter and mouseleave callbacks', () => {
            const onMouseEnter = jest.fn();
            const onMouseLeave = jest.fn();

            getWrapper({ count: 1, onMouseEnter, onMouseLeave });

            fireEvent.mouseEnter(screen.getByText('1'));

            expect(onMouseLeave).toBeCalledTimes(0);
            expect(onMouseEnter).toBeCalledTimes(1);

            fireEvent.mouseLeave(screen.getByText('1'));

            expect(onMouseLeave).toBeCalledTimes(1);
            expect(onMouseEnter).toBeCalledTimes(1);
        });
    });
});
