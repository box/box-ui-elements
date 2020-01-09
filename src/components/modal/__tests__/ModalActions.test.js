import React from 'react';

import ModalActions from '../ModalActions';

describe('components/modal/ModalActions', () => {
    test('should render a div with a class and props when rendered', () => {
        const wrapper = shallow(<ModalActions className="foo">child</ModalActions>);
        expect(wrapper.hasClass('foo')).toBeTruthy();
        expect(wrapper.hasClass('modal-actions')).toBeTruthy();
        expect(wrapper.text()).toEqual('child');
    });
});
