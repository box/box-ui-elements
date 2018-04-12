import React from 'react';
import { shallow } from 'enzyme';

import { InlineDeleteBase as InlineDelete } from '../InlineDelete';

const intl = { formatMessage: () => {} };
const translationProps = {
    intl
};

describe('components/ContentSidebar/ActivityFeed/comment/InlineDelete', () => {
    const render = (props = {}) =>
        shallow(<InlineDelete {...translationProps} id='123' message='test' onDelete={() => {}} {...props} />);

    test('should correctly render comment', () => {
        const wrapper = render();
        expect(wrapper).toMatchSnapshot();
    });

    test('should set bcs-is-confirming class when confirm flyout is open', () => {
        const wrapper = render();
        const flyout = wrapper.find('Flyout');
        expect(wrapper.hasClass('bcs-is-confirming')).toBe(false);
        flyout.prop('onOpen')();
        wrapper.update();
        expect(wrapper.hasClass('bcs-is-confirming')).toBe(true);
        flyout.prop('onClose')();
        wrapper.update();
        expect(wrapper.hasClass('bcs-is-confirming')).toBe(false);
    });

    test('should call onDelete handler when comment deletion is confirmed', () => {
        const onDeleteSpy = jest.fn();
        const wrapper = render({ onDelete: onDeleteSpy });

        const yesBtn = wrapper.find('.bcs-comment-delete-yes');
        yesBtn.simulate('click');

        expect(onDeleteSpy).toHaveBeenCalledWith({ id: '123' });
    });
});
