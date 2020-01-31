import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import makeDroppable from '../makeDroppable';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('elements/common/droppable/makeDroppable', () => {
    const WrappedComponent = () => <div />;
    const MakeDroppableComponent = makeDroppable({
        dropValidator: jest.fn(),
        onDrop: jest.fn(),
    })(WrappedComponent);

    const addEventListenerMock = jest.fn();
    const testElement = document.createElement('div');
    testElement.addEventListener = addEventListenerMock;

    const getWrapper = (props = {}) => shallow(<MakeDroppableComponent className="test" {...props} />);

    beforeEach(() => {
        ReactDOM.findDOMNode.mockImplementation(() => testElement);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('removeEventListeners()', () => {
        test('should remove 4 of event listeners on the element', () => {
            const wrapper = getWrapper();
            const removeEventListener = jest.fn();
            const element = {
                foo: 'bar',
                removeEventListener,
            };

            wrapper.instance().removeEventListeners(element);

            expect(removeEventListener).toBeCalledTimes(4);
        });
    });

    describe('componentDidMount()', () => {
        test('should add 4 event listeners on the test element when the wrapped droppable element is not null for the first time', () => {
            getWrapper();

            expect(addEventListenerMock).toBeCalledTimes(4);
        });
    });

    describe('componentDidUpdate()', () => {
        test('should verify the instance attritute droppableEl is assigned when the wrapped element is not null', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();

            instance.componentDidUpdate();

            expect(instance.droppableEl).toEqual(testElement);
        });

        test('should remove all event listeners on previous droppable element and assign the new droppable element to the instance after the wrapped element is changed', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const spanElement = document.createElement('span');
            const spanRemoveEventListenerMock = jest.fn();
            spanElement.removeEventListener = spanRemoveEventListenerMock;

            instance.droppableEl = spanElement;
            instance.componentDidUpdate();

            expect(spanRemoveEventListenerMock).toBeCalledTimes(4);
            expect(instance.droppableEl).toEqual(testElement);
        });
    });
});
