import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import { InlineEditBase as InlineEdit } from '../InlineEdit';

const sandbox = sinon.sandbox.create();

describe('features/activity-feed/comment/InlineEdit', () => {
    const intl = { formatMessage: () => {} };

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render comment', () => {
        const wrapper = shallow(<InlineEdit id='123' intl={intl} toEdit={() => {}} />);

        expect(wrapper.hasClass('box-ui-comment-edit-container')).toBe(true);
    });

    test('should call toEdit handler when comment deletion is confirmed', () => {
        const toEditSpy = sandbox.spy();

        const wrapper = mount(<InlineEdit id='123' intl={intl} toEdit={toEditSpy} />);

        const editBtn = wrapper.find('.box-ui-comment-edit').hostNodes();
        editBtn.simulate('click');

        expect(toEditSpy.calledWith({ id: '123' })).toBe(true);
    });
});
