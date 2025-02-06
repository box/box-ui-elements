import * as React from 'react';
import { mount } from 'enzyme';
import { act } from 'react';

import makeDroppable from '../makeDroppable';

describe('elements/common/droppable/makeDroppable', () => {
    const WrappedComponent = React.forwardRef((props, ref) => <div ref={ref} data-testid="droppable" {...props} />);
    const dropValidator = jest.fn();
    const onDrop = jest.fn();
    const MakeDroppableComponent = makeDroppable({
        dropValidator,
        onDrop,
    })(WrappedComponent);

    let wrapper;
    let element;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
        wrapper = mount(<MakeDroppableComponent className="test" />, {
            attachTo: element,
        });
    });

    afterEach(() => {
        if (wrapper) {
            // Ensure proper cleanup
            wrapper.detach();
            wrapper = null;
        }
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            element = null;
        }
        jest.clearAllMocks();
    });

    describe('event handlers', () => {
        test('should have drag event handlers', () => {
            const div = wrapper.find('div');
            expect(div.prop('data-candrop')).toBe('false');
            expect(div.prop('data-isdragging')).toBe('false');
            expect(div.prop('data-isover')).toBe('false');
            expect(div.prop('onDragEnter')).toBeDefined();
            expect(div.prop('onDragOver')).toBeDefined();
            expect(div.prop('onDragLeave')).toBeDefined();
            expect(div.prop('onDrop')).toBeDefined();
        });

        test('should clean up properly on unmount', () => {
            const div = wrapper.find('div');

            // Store event handlers before unmount
            const dragHandlers = {
                onDragEnter: div.prop('onDragEnter'),
                onDragOver: div.prop('onDragOver'),
                onDragLeave: div.prop('onDragLeave'),
                onDrop: div.prop('onDrop'),
            };

            // Verify handlers exist
            Object.values(dragHandlers).forEach(handler => {
                expect(handler).toBeDefined();
            });

            // Get initial component count
            const initialCount = wrapper.find('div').length;
            expect(initialCount).toBe(1);

            // Unmount and verify cleanup
            wrapper.unmount();
            wrapper.update();
            expect(wrapper.find('div').length).toBe(0);
        });
    });

    describe('drag and drop behavior', () => {
        test('should handle dragenter event', async () => {
            const file = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockEvent = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
                dataTransfer: {
                    types: ['Files'],
                    files: [file],
                    items: [{ kind: 'file', type: 'text/plain', getAsFile: () => file }],
                    effectAllowed: 'all',
                    dropEffect: 'copy',
                },
                type: 'dragenter',
            };

            await act(async () => {
                wrapper.find('div').prop('onDragEnter')(mockEvent);
                await new Promise(resolve => setTimeout(resolve, 50));
            });

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(dropValidator).toHaveBeenCalledWith(expect.any(Object), mockEvent.dataTransfer);
            wrapper.update();
            expect(wrapper.find('div').prop('data-isover')).toBe('true');
        });

        test('should handle drop event', async () => {
            const file = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockEvent = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
                type: 'drop',
                dataTransfer: {
                    types: ['Files'],
                    files: [file],
                    items: [{ kind: 'file', type: 'text/plain', getAsFile: () => file }],
                    effectAllowed: 'all',
                    dropEffect: 'copy',
                },
            };

            // Simulate complete drag and drop sequence
            await act(async () => {
                // First trigger dragenter
                wrapper.find('div').prop('onDragEnter')(mockEvent);
                await new Promise(resolve => setTimeout(resolve, 50));

                // Then dragover to maintain state
                wrapper.find('div').prop('onDragOver')(mockEvent);
                await new Promise(resolve => setTimeout(resolve, 50));

                // Finally drop
                wrapper.find('div').prop('onDrop')(mockEvent);
                await new Promise(resolve => setTimeout(resolve, 50));
            });

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(onDrop).toHaveBeenCalledWith(
                expect.objectContaining({
                    preventDefault: expect.any(Function),
                    stopPropagation: expect.any(Function),
                    type: 'drop',
                    dataTransfer: mockEvent.dataTransfer,
                }),
                expect.objectContaining({
                    className: expect.stringContaining('test'),
                    'data-candrop': 'false',
                    'data-isdragging': 'false',
                    'data-isover': 'false',
                }),
            );
            wrapper.update();
            expect(wrapper.find('div').prop('data-isover')).toBe('false');
            expect(wrapper.find('div').prop('data-candrop')).toBe('false');
        });
    });
});
