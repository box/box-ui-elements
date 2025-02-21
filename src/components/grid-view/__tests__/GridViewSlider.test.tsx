import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import type { GridViewSliderProps } from '../GridViewSlider';
import GridViewSlider from '../GridViewSlider';

jest.mock('react-intl', () => ({
    useIntl: () => ({
        formatMessage: ({ defaultMessage }) => defaultMessage,
    }),
}));

describe('components/grid-view/GridViewSlider', () => {
    const renderComponent = (props: Partial<GridViewSliderProps> = {}) => {
        const defaultProps = {
            columnCount: 4,
            gridMaxColumns: 7,
            gridMinColumns: 2,
            maxColumnCount: 4,
            onChange: jest.fn(),
        };
        return render(<GridViewSlider {...defaultProps} {...props} />);
    };

    test('should render slider when gridMinColumns is less than maxColumnCount', () => {
        renderComponent();
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
        expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    test('should not render slider when gridMinColumns equals maxColumnCount', () => {
        renderComponent({
            gridMinColumns: 4,
            maxColumnCount: 4,
        });
        expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    });

    test('should call onChange when clicking increase/decrease buttons', () => {
        const onChange = jest.fn();
        renderComponent({ onChange });
        const increaseButton = screen.getByRole('button', { name: 'Increase column size' });
        const decreaseButton = screen.getByRole('button', { name: 'Decrease column size' });
        expect(increaseButton).toBeInTheDocument();
        expect(decreaseButton).toBeInTheDocument();
        fireEvent.click(increaseButton);
        expect(onChange).toHaveBeenCalled();
        fireEvent.click(decreaseButton);
        expect(onChange).toHaveBeenCalledTimes(2);
    });
});
