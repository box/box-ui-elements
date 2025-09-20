import React from 'react';
import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '../../../../test-utils/testing-library';

import makeDroppable from '../makeDroppable';

const TestComponent = React.forwardRef<HTMLDivElement, { className: string; 'data-testid': string }>(
    ({ className, 'data-testid': testId }, ref) => (
        <div className={className} data-testid={testId} ref={ref}>
            Test Content
        </div>
    ),
);

describe('elements/common/droppable/makeDroppable', () => {
    const mockDropValidator = jest.fn();
    const mockOnDrop = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        const DroppableComponent = makeDroppable({
            dropValidator: mockDropValidator,
            onDrop: mockOnDrop,
        })(TestComponent);

        return render(<DroppableComponent data-testid="droppable" />);
    };

    test('should render and handle drag and drop', async () => {
        mockDropValidator.mockReturnValue(true);
        renderComponent();

        const element = screen.getByTestId('droppable');
        const dataTransfer = {} as DataTransfer;

        fireEvent.dragEnter(element, { dataTransfer });
        expect(element).toHaveClass('is-droppable');
        expect(element).toHaveClass('is-over');

        fireEvent.drop(element, { dataTransfer });

        expect(mockOnDrop).toHaveBeenCalledWith(
            expect.objectContaining({
                dataTransfer: expect.any(Object),
                type: 'drop',
            }),
            expect.objectContaining({
                className: expect.any(String),
            }),
        );
    });

    test('should not allow drop when validator returns false', async () => {
        mockDropValidator.mockReturnValue(false);
        renderComponent();

        const element = screen.getByTestId('droppable');
        const dataTransfer = {} as DataTransfer;

        fireEvent.dragEnter(element, { dataTransfer });
        expect(element).not.toHaveClass('is-droppable');
        expect(element).toHaveClass('is-over');

        fireEvent.drop(element, { dataTransfer });

        expect(mockOnDrop).not.toHaveBeenCalled();
    });
});
