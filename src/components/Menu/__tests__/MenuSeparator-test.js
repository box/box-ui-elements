import React from 'react';
import { shallow } from 'enzyme';

import MenuSeparator from '../MenuSeparator';

describe('box-react-ui-overlays/Menu/MenuSeparator', () => {
    it('should correctly render a separator list element', () => {
        const wrapper = shallow(<MenuSeparator />);

        assert.isTrue(wrapper.is('li'));
        assert.equal(wrapper.prop('role'), 'separator');
    });
});
