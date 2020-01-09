import React from 'react';

import SecurityControlsItem from '../SecurityControlsItem';
import IconSecurityClassificationSolid from '../../../../icons/general/IconSecurityClassificationSolid';

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
        wrapper = getWrapper({ controlsFormat: 'shortWithBtn' });

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(IconSecurityClassificationSolid)).toHaveLength(1);
    });

    test('should not render IconSecurityClassificationSolid if controlsFormat is FULL', () => {
        wrapper = getWrapper({ controlsFormat: 'full' });

        expect(wrapper.find(IconSecurityClassificationSolid)).toHaveLength(0);
    });
});
