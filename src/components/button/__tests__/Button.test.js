import React from 'react';
import sinon from 'sinon';

import Button from '..';

const sandbox = sinon.sandbox.create();

describe('components/button/Button', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render children in button', () => {
        const children = 'yooo';

        const wrapper = shallow(<Button>{children}</Button>);

        expect(wrapper.hasClass('bdl-Button')).toBe(true);
        expect(wrapper.find('.bdl-Button-content').length).toEqual(1);
        expect(wrapper.text()).toEqual(children);
    });

    test('should correctly render loading indicator, disable button and hide button content if button is in loading state', () => {
        const wrapper = shallow(<Button isLoading>Test</Button>);

        expect(wrapper.find('.bdl-Button-loadingIndicator').length).toEqual(1);
        expect(wrapper.hasClass('bdl-is-loading')).toBe(true);
    });

    test('simulates click events', () => {
        const onClickHandler = sinon.spy();

        const wrapper = shallow(<Button onClick={onClickHandler} />);

        const contains = sinon.stub();
        contains.withArgs('bdl-is-disabled').returns(false);
        wrapper.instance().btnElement = { classList: { contains } };

        wrapper.find('.bdl-Button').simulate('click');
        expect(onClickHandler.calledOnce).toBe(true);
    });

    test('should not call onClick when isDisabled is set', () => {
        const onClickHandler = sinon.spy();
        const preventDefault = sinon.spy();
        const stopPropagation = sinon.spy();

        const wrapper = shallow(<Button isDisabled onClick={onClickHandler} />);

        const contains = sinon.stub();
        contains.withArgs('bdl-is-disabled').returns(true);
        wrapper.instance().btnElement = { classList: { contains } };

        wrapper.find('.bdl-Button').simulate('click', { preventDefault, stopPropagation });
        sinon.assert.notCalled(onClickHandler);
        sinon.assert.calledOnce(preventDefault);
        sinon.assert.calledOnce(stopPropagation);
    });

    test('should not call onClick when className has bdl-is-disabled', () => {
        const onClickHandler = sinon.spy();
        const preventDefault = sinon.spy();
        const stopPropagation = sinon.spy();

        const wrapper = shallow(<Button className="is-disabled" onClick={onClickHandler} />);

        const contains = sinon.stub();
        contains.withArgs('bdl-is-disabled').returns(true);
        wrapper.instance().btnElement = { classList: { contains } };

        wrapper.find('.bdl-Button').simulate('click', { preventDefault, stopPropagation });
        sinon.assert.notCalled(onClickHandler);
        sinon.assert.calledOnce(preventDefault);
        sinon.assert.calledOnce(stopPropagation);
    });

    test('should have a default type', () => {
        const wrapper = shallow(<Button />);

        expect(wrapper.prop('type')).toEqual('submit');
    });

    test('should set aria-disabled to true when isDisabled is true', () => {
        const wrapper = shallow(<Button isDisabled />);

        expect(wrapper.prop('aria-disabled')).toBe(true);
    });

    test('should not render a RadarAnimation if showRadar is false', () => {
        const wrapper = shallow(<Button showRadar={false}>Test</Button>);
        expect(wrapper.find('RadarAnimation')).toMatchSnapshot();
    });

    test('should render a RadarAnimation if showRadar is true', () => {
        const wrapper = shallow(<Button showRadar>Test</Button>);
        expect(wrapper.find('RadarAnimation')).toMatchSnapshot();
    });
});
