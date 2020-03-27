import React from 'react';
import sinon from 'sinon';

import SlideButton from '../SlideButton';

const sandbox = sinon.sandbox.create();

describe('components/slide-carousel/SlideButton', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const defaultProps = {
        isSelected: true,
    };

    const getWrapper = props => shallow(<SlideButton {...defaultProps} {...props} />);

    test('should have the is-selected class when selected', () => {
        const wrapper = getWrapper({ isSelected: true });
        expect(wrapper.hasClass('is-selected')).toBe(true);
    });

    test('should not have the is-selected class when not selected', () => {
        const wrapper = getWrapper({ isSelected: false });
        expect(wrapper.hasClass('is-selected')).not.toBe(true);
    });

    test('should call onClick prop when clicked', () => {
        const onClickSpy = sandbox.spy();
        const wrapper = getWrapper({ onClick: onClickSpy });
        wrapper.simulate('click');
        sinon.assert.calledOnce(onClickSpy);
    });
});
