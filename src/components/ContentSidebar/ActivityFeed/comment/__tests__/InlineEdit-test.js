import React from 'react';
import { mount, shallow } from 'enzyme';

import { InlineEditBase as InlineEdit } from '../InlineEdit';

describe('features/activity-feed/comment/InlineEdit', () => {
    const intl = { formatMessage: () => {} };

    test('should correctly render comment', () => {
        const wrapper = shallow(<InlineEdit id='123' intl={intl} toEdit={() => {}} />);

        expect(wrapper.hasClass('box-ui-comment-edit-container')).toBe(true);
    });

    test('should call toEdit handler when comment deletion is confirmed', () => {
        const toEditSpy = jest.fn();

        const wrapper = mount(<InlineEdit id='123' intl={intl} toEdit={toEditSpy} />);

        const editBtn = wrapper.find('.box-ui-comment-edit').hostNodes();
        editBtn.simulate('click');

        expect(toEditSpy).toHaveBeenCalledWith({ id: '123' });
    });
});
