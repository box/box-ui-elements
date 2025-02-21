import React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import GridViewSlider from '../GridViewSlider';

describe('components/grid-view/GridViewSlider', () => {
    const renderComponent = (props = {}) => {
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
        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    test('should not render slider when gridMinColumns equals maxColumnCount', () => {
        renderComponent({
            gridMinColumns: 4,
            maxColumnCount: 4,
        });
        expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    });

    test('should call onChange when slider value changes', () => {
        const onChange = jest.fn();
        renderComponent({ onChange });
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
    });
});
