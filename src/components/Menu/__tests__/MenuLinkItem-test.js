import React from 'react';
import { shallow } from 'enzyme';

import MenuLinkItem from '../MenuLinkItem';

const sandbox = sinon.sandbox.create();

describe('box-react-ui-overlays/Menu/MenuLinkItem', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should correctly render a list element and link with correct props', () => {
        const wrapper = shallow(
            <MenuLinkItem>
                <a href='/awesome'>Foo</a>
            </MenuLinkItem>
        );

        assert.isTrue(wrapper.is('li'), 'list element rendered');
        assert.equal(wrapper.prop('role'), 'none');

        const link = wrapper.find('a');
        assert.lengthOf(link, 1, 'must only have 1 link');
        assert.equal(link.prop('role'), 'menuitem');
        assert.equal(link.prop('tabIndex'), -1);
    });
});
