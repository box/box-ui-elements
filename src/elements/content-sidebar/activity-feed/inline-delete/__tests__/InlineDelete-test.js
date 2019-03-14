import * as React from 'react';
import { shallow } from 'enzyme';

import { InlineDeleteBase as InlineDelete } from '../InlineDelete';

const intl = { formatMessage: () => {} };
const translationProps = {
    intl,
};

describe('elements/content-sidebar/ActivityFeed/inline-delete/InlineDelete', () => {
    const id = '123';
    const render = (props = {}) =>
        shallow(<InlineDelete {...translationProps} id={id} message="test" onDelete={() => {}} {...props} />);

    test('should correctly render inline delete', () => {
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

    test('should call onDelete handler when deletion is confirmed', () => {
        const onDeleteSpy = jest.fn();
        const permissions = {
            can_edit: true,
            can_delete: false,
        };
        const wrapper = render({ onDelete: onDeleteSpy, permissions });

        const yesBtn = wrapper.find('.bcs-inline-delete-yes');
        yesBtn.simulate('click');

        expect(onDeleteSpy).toHaveBeenCalledWith({ id, permissions });
    });
});
