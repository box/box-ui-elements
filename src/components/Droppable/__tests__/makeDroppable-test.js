import React from 'react';
import { shallow } from 'enzyme';
import makeDroppable from '../';

const sandbox = sinon.sandbox.create();

describe('Droppable/makeDroppable', () => {
    let clock;
    let context;
    let TestComponent;

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
        context = {
            dragDrop: {
                getDragItem: () => {}
            }
        };
        TestComponent = () => <div className='test-component'>droppable</div>;
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should correctly wrap the base component and set props', () => {
        const DroppableComponent = makeDroppable({})(TestComponent);
        const component = shallow(<DroppableComponent />);

        assert.equal(component.find('TestComponent').length, 1);
        assert.isDefined(component.find('TestComponent').prop('canDrop'));
        assert.isDefined(component.find('TestComponent').prop('isDragging'));
        assert.isDefined(component.find('TestComponent').prop('isOver'));
    });

    it('should correctly set the initial state', () => {
        const DroppableComponent = makeDroppable({})(TestComponent);
        const component = shallow(<DroppableComponent />);

        assert.equal(component.state('canDrop'), false);
        assert.equal(component.state('isOver'), false);
    });

    it('should set isOver to true and default canDrop to true on handleDragEnter', () => {
        const DroppableComponent = makeDroppable({})(TestComponent);
        const component = shallow(<DroppableComponent />);
        const instance = component.instance();

        assert.equal(component.state('isOver'), false);
        instance.handleDragEnter({
            dataTransfer: {},
            preventDefault: sandbox.mock().once()
        });
        assert.equal(component.state('isOver'), true);
        assert.equal(component.state('canDrop'), true);
    });

    it('should call dropValidator on handleDragEnter if it was passed in', () => {
        const dropDefinition = {
            dropValidator: sandbox.mock().once().returns(false)
        };
        const DroppableComponent = makeDroppable(dropDefinition)(TestComponent);
        const component = shallow(<DroppableComponent />);
        const instance = component.instance();

        assert.equal(component.state('isOver'), false);
        instance.handleDragEnter({
            dataTransfer: {},
            preventDefault: sandbox.mock().once()
        });
        assert.equal(component.state('isOver'), true);
        assert.equal(component.state('canDrop'), false);
    });

    it('should pass props, dataTransfer into dropValidator', () => {
        const props = {
            className: 'abc'
        };
        const dataTransfer = {};

        const dropDefinition = {
            dropValidator: sandbox.mock().withArgs(props, dataTransfer).once().returns(true)
        };
        const DroppableComponent = makeDroppable(dropDefinition)(TestComponent);
        const component = shallow(<DroppableComponent {...props} />);
        const instance = component.instance();

        assert.equal(component.state('isOver'), false);
        instance.handleDragEnter({
            dataTransfer,
            preventDefault: sandbox.mock().once()
        });
        assert.equal(component.state('isOver'), true);
        assert.equal(component.state('canDrop'), true);
    });

    it('should set dropEffect to none on handleDragOver if canDrop is false', () => {
        const DroppableComponent = makeDroppable({})(TestComponent);
        const component = shallow(<DroppableComponent />);
        const instance = component.instance();
        const event = {
            dataTransfer: {},
            preventDefault: sandbox.mock().once()
        };

        instance.setState({
            canDrop: false
        });

        instance.handleDragOver(event);
        assert.equal(event.dataTransfer.dropEffect, 'none');
    });

    it('should set dropEffect on handleDragOver if canDrop is true and dropEffect was defined', () => {
        const DroppableComponent = makeDroppable({})(TestComponent);
        const component = shallow(<DroppableComponent />);
        const instance = component.instance();
        const event = {
            dataTransfer: {
                effectAllowed: 'move'
            },
            preventDefault: sandbox.mock().once()
        };

        instance.setState({
            canDrop: true
        });

        instance.handleDragOver(event);
        assert.equal(event.dataTransfer.dropEffect, event.dataTransfer.effectAllowed);
    });

    it('should prevent default event on handleDragOver', () => {
        const DroppableComponent = makeDroppable({})(TestComponent);
        const component = shallow(<DroppableComponent />);
        const instance = component.instance();

        instance.setState({
            canDrop: true
        });

        instance.handleDragOver({
            dataTransfer: {},
            preventDefault: sandbox.mock().once()
        });
    });

    it('should prevent default event and reset state on handleDrop', () => {
        const DroppableComponent = makeDroppable({})(TestComponent);
        const component = shallow(<DroppableComponent />);
        const instance = component.instance();

        instance.handleDrop({
            preventDefault: sandbox.mock().once()
        });

        assert.equal(component.state('canDrop'), false);
        assert.equal(component.state('isDragging'), false);
        assert.equal(component.state('isOver'), false);
    });

    it('should call onDrop if canDrop is true and onDrop is passed in through props', () => {
        const event = {
            preventDefault: sandbox.mock().once()
        };
        const dropDefinition = {
            onDrop: sandbox.mock().once()
        };

        const DroppableComponent = makeDroppable(dropDefinition)(TestComponent);
        const component = shallow(<DroppableComponent />, { context });
        const instance = component.instance();
        instance.setState({
            canDrop: true
        });

        instance.handleDrop(event);
        clock.tick(10);
    });
});
