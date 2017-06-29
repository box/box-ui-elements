import React from 'react';
import { shallow } from 'enzyme';
import { Button, PrimaryButton } from '../';

const sandbox = sinon.sandbox.create();

describe('Button/PrimaryButton', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should correctly render children in primary button', () => {
        const children = 'yooo';

        const wrapper = shallow(<PrimaryButton>{children}</PrimaryButton>);

        assert.equal(wrapper.find(Button).length, 1);
        assert.isTrue(wrapper.hasClass('buik-btn-primary'), true);
        assert.isTrue(wrapper.contains(children), true);
    });
});
