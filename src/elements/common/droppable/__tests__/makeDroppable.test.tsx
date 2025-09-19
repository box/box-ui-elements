import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import makeDroppable from '../makeDroppable';

// Test component that will be wrapped with makeDroppable
const TestComponent = React.forwardRef<HTMLDivElement, { className?: string; 'data-testid'?: string }>(
    ({ className, 'data-testid': testId, ...props }, ref) => (
        <div ref={ref} className={className} data-testid={testId || 'test-component'} {...props}>
            Test Content
        </div>
    ),
);

TestComponent.displayName = 'TestComponent';

describe('elements/common/droppable/makeDroppable', () => {
    const mockDropValidator = jest.fn();
    const mockOnDrop = jest.fn();
    const createDT = () => (typeof DataTransfer === 'function' ? new DataTransfer() : ({} as DataTransfer));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic functionality', () => {
        test('should render wrapped component with correct props', () => {
            const DroppableComponent = makeDroppable({
                dropValidator: mockDropValidator,
                onDrop: mockOnDrop,
            })(TestComponent);

            render(<DroppableComponent className="test-class" data-testid="droppable" />);

            const element = screen.getByTestId('droppable');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('test-class');
            expect(element).toHaveTextContent('Test Content');
        });

        test('should apply droppable classes when canDrop is true', async () => {
            mockDropValidator.mockReturnValue(true);
            const DroppableComponent = makeDroppable({
                dropValidator: mockDropValidator,
                onDrop: mockOnDrop,
            })(TestComponent);

            render(<DroppableComponent data-testid="droppable" />);

            const element = screen.getByTestId('droppable');

            // Simulate drag enter
            fireEvent.dragEnter(element, {
                dataTransfer: createDT(),
            });

            await waitFor(() => expect(element).toHaveClass('is-droppable'));
            await waitFor(() => expect(element).toHaveClass('is-over'));
        });
    });

    describe('Drag and drop events', () => {
        test('should call dropValidator on drag enter', () => {
            const mockProps = { className: 'test' };
            mockDropValidator.mockReturnValue(true);
            const DroppableComponent = makeDroppable({
                dropValidator: mockDropValidator,
                onDrop: mockOnDrop,
            })(TestComponent);

            render(<DroppableComponent {...mockProps} data-testid="droppable" />);

            const element = screen.getByTestId('droppable');
            const dataTransfer = createDT();

            fireEvent.dragEnter(element, { dataTransfer });

            expect(mockDropValidator).toHaveBeenCalledWith(expect.objectContaining(mockProps), dataTransfer);
        });

        test('should call onDrop when item is dropped and canDrop is true', async () => {
            mockDropValidator.mockReturnValue(true);
            const DroppableComponent = makeDroppable({
                dropValidator: mockDropValidator,
                onDrop: mockOnDrop,
            })(TestComponent);

            render(<DroppableComponent data-testid="droppable" />);

            const element = screen.getByTestId('droppable');
            const dataTransfer = createDT();

            // First drag enter to set canDrop to true, then drop
            fireEvent.dragEnter(element, { dataTransfer });
            fireEvent.drop(element, { dataTransfer });

            await waitFor(() => expect(mockOnDrop).toHaveBeenCalled());
        });

        test('should not call onDrop when canDrop is false', async () => {
            mockDropValidator.mockReturnValue(false);
            const DroppableComponent = makeDroppable({
                dropValidator: mockDropValidator,
                onDrop: mockOnDrop,
            })(TestComponent);

            render(<DroppableComponent data-testid="droppable" />);

            const element = screen.getByTestId('droppable');
            const dataTransfer = createDT();

            // Drag enter with canDrop false, then drop
            fireEvent.dragEnter(element, { dataTransfer });
            fireEvent.drop(element, { dataTransfer });

            await waitFor(() => expect(mockOnDrop).not.toHaveBeenCalled());
        });
    });

    describe('Component lifecycle', () => {
        test('should add event listeners on mount and remove them on unmount', () => {
            const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');
            const removeEventListenerSpy = jest.spyOn(Element.prototype, 'removeEventListener');

            const DroppableComponent = makeDroppable({
                dropValidator: mockDropValidator,
                onDrop: mockOnDrop,
            })(TestComponent);

            const { unmount } = render(<DroppableComponent data-testid="droppable" />);

            // Verify event listeners were added
            expect(addEventListenerSpy).toHaveBeenCalledWith('dragenter', expect.any(Function));
            expect(addEventListenerSpy).toHaveBeenCalledWith('dragover', expect.any(Function));
            expect(addEventListenerSpy).toHaveBeenCalledWith('dragleave', expect.any(Function));
            expect(addEventListenerSpy).toHaveBeenCalledWith('drop', expect.any(Function));

            // Unmount component
            unmount();

            // Verify event listeners were removed
            expect(removeEventListenerSpy).toHaveBeenCalledWith('dragenter', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('dragover', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('dragleave', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('drop', expect.any(Function));

            addEventListenerSpy.mockRestore();
            removeEventListenerSpy.mockRestore();
        });
    });

    describe('Edge cases', () => {
        test('should work without dropValidator (defaults to true)', async () => {
            const DroppableComponent = makeDroppable({
                onDrop: mockOnDrop,
            })(TestComponent);

            render(<DroppableComponent data-testid="droppable" />);

            const element = screen.getByTestId('droppable');
            const dataTransfer = createDT();

            fireEvent.dragEnter(element, { dataTransfer });
            await waitFor(() => expect(element).toHaveClass('is-droppable'));
            await waitFor(() => expect(element).toHaveClass('is-over'));
        });
    });
});
