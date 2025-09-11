import * as React from 'react';
import { shallow } from 'enzyme';

import makeDroppable from '../makeDroppable';

describe('elements/common/droppable/makeDroppable', () => {
    const WrappedComponent = React.forwardRef((props, ref) => <div ref={ref} />);
    const MakeDroppableComponent = makeDroppable({
        dropValidator: jest.fn(),
        onDrop: jest.fn(),
    })(WrappedComponent);

    const getWrapper = (props = {}) => shallow(<MakeDroppableComponent className="test" {...props} />);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('setDroppableRef()', () => {
        test('should add 4 event listeners when ref callback is called with element', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const testElement = document.createElement('div');
            const addEventListenerMock = jest.fn();
            testElement.addEventListener = addEventListenerMock;

            // Call the actual setDroppableRef method with test element
            instance.setDroppableRef(testElement);

            expect(addEventListenerMock).toBeCalledTimes(4);
            expect(instance.droppableEl).toEqual(testElement);
        });

        test('should verify the instance attribute droppableEl is assigned when the wrapped element is not null', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const testElement = document.createElement('div');
            const addEventListenerMock = jest.fn();
            testElement.addEventListener = addEventListenerMock;

            // Initially droppableEl should be null
            expect(instance.droppableEl).toBe(null);

            // Call setDroppableRef with a valid element
            instance.setDroppableRef(testElement);

            // Verify droppableEl is assigned to the element
            expect(instance.droppableEl).toEqual(testElement);
            expect(addEventListenerMock).toBeCalledTimes(4);
        });

        test('should remove listeners from old element and add to new element', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const oldElement = document.createElement('span');
            const oldRemoveEventListenerMock = jest.fn();
            oldElement.removeEventListener = oldRemoveEventListenerMock;

            const newElement = document.createElement('div');
            const newAddEventListenerMock = jest.fn();
            newElement.addEventListener = newAddEventListenerMock;

            instance.droppableEl = oldElement;
            instance.setDroppableRef(newElement);

            expect(oldRemoveEventListenerMock).toBeCalledTimes(4);
            expect(newAddEventListenerMock).toBeCalledTimes(4);
            expect(instance.droppableEl).toEqual(newElement);
        });

        test('should handle null element (unmount)', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const oldElement = document.createElement('div');
            const oldRemoveEventListenerMock = jest.fn();
            oldElement.removeEventListener = oldRemoveEventListenerMock;

            instance.droppableEl = oldElement;
            instance.setDroppableRef(null);

            expect(oldRemoveEventListenerMock).toBeCalledTimes(4);
            expect(instance.droppableEl).toBeNull();
        });
    });
});
