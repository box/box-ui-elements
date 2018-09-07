import * as React from 'react';
import { mount, shallow } from 'enzyme';

import { InlineEditBase as InlineEdit } from '../InlineEdit';

describe('components/ContentSidebar/ActivityFeed/comment/InlineEdit', () => {
    const intl = { formatMessage: () => {} };

    test('should correctly render comment', () => {
        const wrapper = shallow(
            <InlineEdit id="123" intl={intl} toEdit={() => {}} />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should call toEdit handler when comment deletion is confirmed', () => {
        const toEditSpy = jest.fn();

        const wrapper = mount(
            <InlineEdit id="123" intl={intl} toEdit={toEditSpy} />,
        );

        const editBtn = wrapper.find('.bcs-comment-edit').hostNodes();
        editBtn.simulate('click');

        expect(toEditSpy).toHaveBeenCalledWith({ id: '123' });
    });
});
