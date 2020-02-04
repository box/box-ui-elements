import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import DragCloud from '../DragCloud';
import DropCloud from '../DropCloud';
import SecurityCloudGame from '../SecurityCloudGame';

const sandbox = sinon.sandbox.create();
jest.mock('../DragCloud');
jest.mock('../DropCloud');

describe('features/security-cloud-game/SecurityCloudGame', () => {
    let clock;

    const DragCloudMock = () => <div />;
    const DropCloudMock = () => <div />;
    DragCloud.mockImplementation(DragCloudMock);
    DropCloud.mockImplementation(DropCloudMock);

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        DragCloud.mockClear();
        DropCloud.mockClear();
    });

    test('should correctly render', () => {
        const mock = sandbox.mock(SecurityCloudGame.prototype);
        mock.expects('renderMessage').once();
        mock.expects('setGameBoardHeight').once();

        const component = mount(<SecurityCloudGame cloudSize={50} height={100} width={100} />);

        expect(component.find('.box-ui-security-cloud-game').length).toEqual(1);
        expect(component.find('.box-ui-security-cloud-game').prop('style')).toEqual({
            height: '100px',
            width: '100px',
        });
        expect(component.find('.box-ui-security-cloud-game-message').length).toEqual(1);
    });

    test('should correctly calculate cloud positions', () => {
        const spy = sandbox.spy(SecurityCloudGame.prototype, 'getRandomCloudPosition');
        const stubRandomMethod = sandbox.stub(SecurityCloudGame.prototype, 'getRandom').returns(0.1);

        stubRandomMethod.onCall(0).returns(0.1);
        stubRandomMethod.onCall(1).returns(0.1);
        stubRandomMethod.onCall(2).returns(0.5);
        stubRandomMethod.onCall(3).returns(0.5);
        const component = mount(<SecurityCloudGame cloudSize={10} height={1000} width={1000} />);

        expect(component.state('dropCloudPosition')).toEqual({
            x: 98,
            y: 98,
        });
        expect(component.state('dragCloudPosition')).toEqual({
            x: 490,
            y: 490,
        });
        expect(component.state('isValidDrop')).toEqual(false);
        expect(spy.calledTwice).toBe(true);
    });

    test('should retry getRandomCloudPosition if overlap was found', () => {
        const spy = sandbox.spy(SecurityCloudGame.prototype, 'getRandomCloudPosition');
        const stubMethod = sandbox.stub(SecurityCloudGame.prototype, 'checkOverlap');
        stubMethod.onFirstCall().returns(true);
        stubMethod.onSecondCall().returns(false);

        mount(<SecurityCloudGame cloudSize={50} height={100} width={100} />);

        // getRandomCloudPosition should be called 3x (two for first call, one for second)
        expect(spy.calledThrice).toBe(true);
    });

    test('should return true if checkOverlap is called with an overlapping position', () => {
        const mock = sandbox.mock(SecurityCloudGame.prototype);
        mock.expects('checkOverlap')
            .once()
            .returns(false);

        const component = mount(<SecurityCloudGame cloudSize={10} height={100} width={100} />);
        const instance = component.instance();
        mock.restore();

        expect(instance.checkOverlap({ x: 0, y: 0 }, { x: 100, y: 100 })).toBe(false);
        expect(instance.checkOverlap({ x: 100, y: 100 }, { x: 0, y: 0 })).toBe(false);
        expect(instance.checkOverlap({ x: 10, y: 10 }, { x: 10, y: 10 })).toBe(true);
        expect(instance.checkOverlap({ x: 0, y: 0 }, { x: 5, y: 5 })).toBe(true);
        expect(instance.checkOverlap({ x: 5, y: 5 }, { x: 0, y: 0 })).toBe(true);
    });

    test('should render drop region and clouds', () => {
        const stubMethod = sandbox.stub(SecurityCloudGame.prototype, 'getRandomCloudPosition').returns({ x: 5, y: 5 });
        sandbox.stub(SecurityCloudGame.prototype, 'checkOverlap').returns(false);

        stubMethod.onFirstCall().returns({ x: 10, y: 10 });
        stubMethod.onSecondCall().returns({ x: 5, y: 5 });

        const component = mount(<SecurityCloudGame cloudSize={10} height={100} width={100} />);

        expect(component.find(DragCloud).length).toEqual(1);
        expect(component.find(DragCloud).prop('cloudSize')).toEqual(10);
        expect(component.find(DragCloud).prop('position')).toEqual({
            x: 5,
            y: 5,
        });
        expect(component.find(DropCloud).length).toEqual(1);
        expect(component.find(DropCloud).prop('cloudSize')).toEqual(10);
        expect(component.find(DropCloud).prop('position')).toEqual({
            x: 10,
            y: 10,
        });
    });

    test('should only render drop cloud if isValidDrop is false', () => {
        const stubMethod = sandbox.stub(SecurityCloudGame.prototype, 'getRandomCloudPosition');
        sandbox.stub(SecurityCloudGame.prototype, 'checkOverlap').returns(false);
        stubMethod.onFirstCall().returns({ x: 10, y: 10 }); // this one is the drop position
        stubMethod.onSecondCall().returns({ x: 5, y: 5 });

        const component = shallow(<SecurityCloudGame cloudSize={10} height={100} width={100} />);

        component.setState({
            gameBoardHeight: 10,
            isValidDrop: true,
        });

        expect(component.find(DragCloud).length).toEqual(1);
        expect(component.find(DragCloud).prop('position')).toEqual({
            x: 5,
            y: 5,
        });
        expect(component.find(DropCloud).length).toEqual(0);
    });

    test('should render an instructional message when renderMessage is called', () => {
        const mock = sandbox.mock(SecurityCloudGame.prototype);
        mock.expects('checkOverlap')
            .once()
            .returns(false);

        const component = mount(<SecurityCloudGame cloudSize={10} height={100} width={100} />);
        const instance = component.instance();

        const message = instance.renderMessage();

        expect(message.props.defaultMessage).toEqual(
            'For security purposes, please drag the white cloud into the dark cloud.',
        );
    });

    test('should render a success message when renderMessage is called and isValidDrop is true', () => {
        const mock = sandbox.mock(SecurityCloudGame.prototype);
        mock.expects('checkOverlap')
            .once()
            .returns(false);

        const component = mount(<SecurityCloudGame cloudSize={10} height={100} width={100} />);
        const instance = component.instance();
        instance.setState({
            isValidDrop: true,
        });

        const message = instance.renderMessage();

        expect(message.props.defaultMessage).toEqual('Success!');
    });

    test('should correctly set isOverlap onDrag', () => {
        const stubCheckMethod = sandbox.stub(SecurityCloudGame.prototype, 'checkOverlap').returns(false);

        const component = mount(<SecurityCloudGame cloudSize={10} height={100} width={100} />);
        const instance = component.instance();
        expect(instance.state.isOverlap).toBe(false);

        stubCheckMethod.returns(true);

        instance.onDrag({}, { x: 0, y: 0 });
        expect(instance.state.isOverlap).toBe(true);

        // onDrag is throttled so need to be wait a tick.
        clock.tick(500);

        stubCheckMethod.returns(false);
        instance.onDrag({}, { x: 0, y: 0 });
        expect(instance.state.isOverlap).toBe(false);
    });

    test('should set isValidDrop on valid drop', () => {
        const onDrop = sinon.spy();

        const component = mount(<SecurityCloudGame cloudSize={10} height={100} width={100} onValidDrop={onDrop} />);
        const instance = component.instance();

        instance.onDragStop();

        expect(instance.state.isValidDrop).toBe(false);

        instance.setState({ isOverlap: true });
        instance.onDragStop();

        expect(instance.state.isValidDrop).toBe(true);
        expect(onDrop.calledOnce).toBe(true);
    });
});
