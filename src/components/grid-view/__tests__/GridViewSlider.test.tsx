import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, render } from '../../../test-utils/testing-library';
import GridViewSlider, { GridViewSliderProps } from '../GridViewSlider';

describe('GridViewSlider', () => {
    const defaultProps = {
        columnCount: 3,
        gridMaxColumns: 5,
        gridMinColumns: 1,
        maxColumnCount: 4,
        onChange: jest.fn(),
    };

    const renderComponent = (props: Partial<GridViewSliderProps> = {}) =>
        render(<GridViewSlider {...defaultProps} {...props} />);

    test('should render slider with correct initial value', () => {
        renderComponent();
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
        expect(slider).toHaveAttribute('aria-valuenow', '3');
    });

    test('should render slider with correct labels', () => {
        renderComponent();
        expect(screen.getByLabelText('Increase column size')).toBeInTheDocument();
        expect(screen.getByLabelText('Decrease column size')).toBeInTheDocument();
        expect(screen.getByLabelText('Grid view size')).toBeInTheDocument();
    });

    test('should call onChange when slider value changes', async () => {
        const onChange = jest.fn();
        renderComponent({ onChange });

        const increaseButton = screen.getByRole('button', { name: 'Increase column size' });
        await userEvent.click(increaseButton);
        expect(onChange).toHaveBeenCalledTimes(1);

        const decreaseButton = screen.getByRole('button', { name: 'Decrease column size' });
        await userEvent.click(decreaseButton);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test('should not render slider if gridMinColumns is greater than or equal to maxColumnCount', () => {
        renderComponent({ gridMinColumns: 4, maxColumnCount: 4 });
        const slider = screen.queryByRole('slider');
        expect(slider).not.toBeInTheDocument();
    });
});
