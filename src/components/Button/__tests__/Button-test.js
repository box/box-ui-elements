import React from 'react';
import { shallow, mount } from 'enzyme';
import { Button } from '../';

const sandbox = sinon.sandbox.create();

describe('Button/Button', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should correctly render children in button', () => {
        const children = 'yooo';

        const wrapper = shallow(
            <Button>
                {children}
            </Button>
        );

        assert.isTrue(wrapper.hasClass('buik-btn'));
        assert.equal(wrapper.find('.buik-btn-content').length, 1);
        assert.equal(wrapper.text(), children);
    });

    // eslint-disable-next-line
    it('should correctly render loading indicator, disable button and hide button content if button is in loading state', () => {
        const wrapper = shallow(<Button isLoading>Test</Button>);

        assert.equal(wrapper.find('.buik-btn-loading-indicator').length, 1);
        assert.isTrue(wrapper.hasClass('buik-btn-is-loading'));
    });

    it('simulates click events', () => {
        const onClickHandler = sinon.spy();

        const wrapper = mount(<Button onClick={onClickHandler} />);

        const contains = sinon.stub();
        contains.withArgs('buik-btn-is-disabled').returns(false);
        wrapper.instance().btnElement = { classList: { contains } };

        wrapper.find('button').simulate('click');
        assert.isTrue(onClickHandler.calledOnce);
    });

    it('should not call onClick when isDisabled is set', () => {
        const onClickHandler = sinon.spy();
        const preventDefault = sinon.spy();
        const stopPropagation = sinon.spy();

        const wrapper = shallow(<Button onClick={onClickHandler} isDisabled />);

        const contains = sinon.stub();
        contains.withArgs('buik-btn-is-disabled').returns(true);
        wrapper.instance().btnElement = { classList: { contains } };

        wrapper.find('button').simulate('click', { preventDefault, stopPropagation });
        sinon.assert.notCalled(onClickHandler);
        sinon.assert.calledOnce(preventDefault);
        sinon.assert.calledOnce(stopPropagation);
    });

    it('should not call onClick when className has is-disabled', () => {
        const onClickHandler = sinon.spy();
        const preventDefault = sinon.spy();
        const stopPropagation = sinon.spy();

        const wrapper = mount(<Button onClick={onClickHandler} className='buik-btn-is-disabled' />);

        const contains = sinon.stub();
        contains.withArgs('buik-btn-is-disabled').returns(true);
        wrapper.instance().btnElement = { classList: { contains } };

        wrapper.find('button').simulate('click', { preventDefault, stopPropagation });
        sinon.assert.notCalled(onClickHandler);
        sinon.assert.calledOnce(preventDefault);
        sinon.assert.calledOnce(stopPropagation);
    });

    it('should have a default type', () => {
        const wrapper = shallow(<Button />);

        assert.equal(wrapper.prop('type'), 'button');
    });

    it('should set aria-disabled to true when isDisabled is true', () => {
        const wrapper = shallow(<Button isDisabled />);

        assert.isTrue(wrapper.prop('aria-disabled'));
    });
});
