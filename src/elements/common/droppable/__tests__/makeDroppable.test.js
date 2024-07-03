import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import makeDroppable from '../makeDroppable';

const MockComponent = React.forwardRef((props, ref) => (
    <div ref={ref} {...props}>
        Drop here
    </div>
));

describe('makeDroppable HOC with react-testing-library', () => {
    const dropValidator = jest.fn();
    const onDrop = jest.fn();
    const DroppableComponent = makeDroppable({ dropValidator, onDrop })(MockComponent);
    const eventOptions = { preventDefault: () => {} };

    beforeEach(() => {
        // Reset mocks before each test
        dropValidator.mockClear();
        onDrop.mockClear();
    });

    test('should call onDrop when drop is valid', () => {
        dropValidator.mockReturnValue(true);
        const { getByText } = render(<DroppableComponent />);
        const component = getByText('Drop here');
        fireEvent.dragEnter(component, eventOptions);
        fireEvent.drop(component, eventOptions);

        expect(onDrop).toHaveBeenCalled();
    });

    test('should not call onDrop when drop is invalid', () => {
        dropValidator.mockReturnValue(false);
        const { getByText } = render(<DroppableComponent />);
        const component = getByText('Drop here');
        fireEvent.dragEnter(component, eventOptions);
        fireEvent.drop(component, eventOptions);

        expect(onDrop).not.toHaveBeenCalled();
    });

    test('should update class to indicate droppable state on drag enter and leave', () => {
        const { getByText } = render(<DroppableComponent />);
        const component = getByText('Drop here');
        fireEvent.dragEnter(component, eventOptions);
        expect(component).toHaveClass('is-over');

        fireEvent.dragLeave(component, eventOptions);
        expect(component).not.toHaveClass('is-over');
    });

    test('should reset class to indicate not droppable after drop', () => {
        const { getByText } = render(<DroppableComponent />);
        const component = getByText('Drop here');
        fireEvent.dragEnter(component, eventOptions);
        fireEvent.drop(component, eventOptions);
        expect(component).not.toHaveClass('is-over');
    });
});
