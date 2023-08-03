import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import Button from '..';

const sandbox = sinon.sandbox.create();

describe('components/button/Button', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render children in button', () => {
        const children = 'yooo';

        const wrapper = shallow(<Button>{children}</Button>);

        expect(wrapper.hasClass('btn')).toBe(true);
        expect(wrapper.find('.btn-content').length).toEqual(1);
        expect(wrapper.text()).toEqual(children);
    });

    test('should correctly render loading indicator, disable button and hide button content if button is in loading state', () => {
        const wrapper = shallow(<Button isLoading>Test</Button>);

        expect(wrapper.find('.btn-loading-indicator').length).toEqual(1);
        expect(wrapper.hasClass('is-loading')).toBe(true);
    });

    test('simulates click events', () => {
        const onClickHandler = sinon.spy();

        const wrapper = shallow<Button>(<Button onClick={onClickHandler} />);

        wrapper.find('button').simulate('click');
        expect(onClickHandler.calledOnce).toBe(true);
    });

    test('should not call onClick when isDisabled is set', () => {
        const onClickHandler = sinon.spy();
        const preventDefault = sinon.spy();
        const stopPropagation = sinon.spy();

        const wrapper = shallow<Button>(<Button isDisabled onClick={onClickHandler} />);

        wrapper.find('button').simulate('click', { preventDefault, stopPropagation });
        sinon.assert.notCalled(onClickHandler);
        sinon.assert.calledOnce(preventDefault);
        sinon.assert.calledOnce(stopPropagation);
    });

    test('should not call onClick when className has is-disabled', () => {
        const onClickHandler = sinon.spy();
        const preventDefault = sinon.spy();
        const stopPropagation = sinon.spy();

        const wrapper = shallow<Button>(<Button className="is-disabled" onClick={onClickHandler} />);

        const contains = sinon.stub();
        contains.withArgs('is-disabled').returns(true);
        wrapper.instance().btnElement = { classList: { contains } } as any; // eslint-disable-line

        wrapper.find('button').simulate('click', { preventDefault, stopPropagation });
        sinon.assert.notCalled(onClickHandler);
        sinon.assert.calledOnce(preventDefault);
        sinon.assert.calledOnce(stopPropagation);
    });

    test('should have a default type', () => {
        const wrapper = shallow(<Button />);

        expect(wrapper.prop('type')).toEqual('submit');
    });

    test('should add modifier class when size is "large"', () => {
        const wrapper = shallow(<Button size="large">Click Here</Button>);

        expect(wrapper.prop('className')).toEqual('btn bdl-btn--large');
    });

    test('should render icon in icon container if icon prop is set', () => {
        const FakeIcon = (props: Record<string, unknown>) => <svg {...props} />;
        const wrapper = shallow(<Button icon={<FakeIcon />} />);
        const iconContainer = wrapper.find('.bdl-btn-icon');
        const { width, height } = iconContainer.find('FakeIcon').props();
        expect(wrapper.props().className).toEqual('btn bdl-has-icon');
        expect(iconContainer.length).toBe(1);
        expect(width).toEqual(height);
        expect(width).toEqual(20);
    });

    test('should render icon next to text if icon and children props are both set', () => {
        const FakeIcon = (props: Record<string, unknown>) => <svg {...props} />;
        const wrapper = shallow(<Button icon={<FakeIcon />}>Click Here</Button>);
        const iconContainer = wrapper.find('.bdl-btn-icon');
        const textContainer = wrapper.find('.btn-content');
        const { width, height } = iconContainer.find('FakeIcon').props();
        expect(iconContainer.length).toBe(1);
        expect(textContainer.length).toBe(1);
        expect(width).toEqual(height);
        expect(width).toEqual(16);

        expect(wrapper).toMatchSnapshot();
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
