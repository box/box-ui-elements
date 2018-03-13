import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { InlineDeleteBase as InlineDelete } from '../InlineDelete';

const sandbox = sinon.sandbox.create();

const intl = { formatMessage: () => {} };
const translationProps = {
    intl
};

describe('features/activity-feed/comment/InlineDelete', () => {
    const render = (props = {}) =>
        shallow(<InlineDelete {...translationProps} id='123' message='test' onDelete={() => {}} {...props} />);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render comment', () => {
        const wrapper = render();

        expect(wrapper.hasClass('box-ui-comment-delete-container')).toBe(true);
        expect(wrapper.find('Flyout').length).toEqual(1);
        expect(wrapper.find('.box-ui-comment-delete').length).toEqual(1);
        expect(wrapper.find('b').contains('test')).toBe(true);
    });

    test('should set is-confirming class when confirm flyout is open', () => {
        const wrapper = render();
        const flyout = wrapper.find('Flyout');
        expect(wrapper.hasClass('is-confirming')).toBe(false);
        flyout.prop('onOpen')();
        wrapper.update();
        expect(wrapper.hasClass('is-confirming')).toBe(true);
        flyout.prop('onClose')();
        wrapper.update();
        expect(wrapper.hasClass('is-confirming')).toBe(false);
    });

    test('should call onDelete handler when comment deletion is confirmed', () => {
        const onDeleteSpy = sandbox.spy();
        const wrapper = render({ onDelete: onDeleteSpy });

        const yesBtn = wrapper.find('.box-ui-comment-delete-yes');
        yesBtn.simulate('click');

        expect(onDeleteSpy.calledWith({ id: '123' })).toBe(true);
    });
});
