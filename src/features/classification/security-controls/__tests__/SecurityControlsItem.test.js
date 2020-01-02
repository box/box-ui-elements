import React from 'react';

import SecurityControlsItem from '../SecurityControlsItem';

describe('features/classification/security-controls/SecurityControlsItem', () => {
    let wrapper;
    let message;

    const getWrapper = (props = {}) => shallow(<SecurityControlsItem message={message} {...props} />);

    beforeEach(() => {
        message = {
            id: 'msg1',
            defaultMessage: 'message',
        };
        wrapper = getWrapper();
    });

    test('should render a SecurityControlsItem with a message', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
