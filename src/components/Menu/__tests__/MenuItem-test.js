import React from 'react';
import { shallow } from 'enzyme';

import MenuItem from '../MenuItem';

const sandbox = sinon.sandbox.create();

describe('box-react-ui-overlays/Menu/MenuItem', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        it('should correctly render a list element with correct props', () => {
            const wrapper = shallow(
                <MenuItem>
                    Test
                </MenuItem>
            );

            assert.isTrue(wrapper.is('li'), 'list element rendered');
            assert.equal(wrapper.prop('role'), 'menuitem');
            assert.equal(wrapper.prop('tabIndex'), -1);
        });
    });

    describe('onClickHandler()', () => {
        it('should click when menu item has isDisabled prop', () => {
            const wrapper = shallow(
                <MenuItem onClick={sandbox.mock().never()} isDisabled>
                    Test
                </MenuItem>
            );

            wrapper.simulate('click', {
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock()
            });
        });

        it('should fire onClick when it exists', () => {
            const wrapper = shallow(
                <MenuItem onClick={sandbox.mock()}>
                    Test
                </MenuItem>
            );

            wrapper.simulate('click', {
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never()
            });
        });
    });
});
