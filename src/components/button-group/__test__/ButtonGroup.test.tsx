import React from 'react';
import { mount } from 'enzyme';

import Button from '../../button';
import ButtonGroup from '..';

describe('components/button-group/ButtonGroup', () => {
    test('should render correct ButtonGroup', () => {
        const wrapper = mount(
            <ButtonGroup>
                <Button>Add</Button>
                <Button>Update</Button>
                <Button>Remove</Button>
            </ButtonGroup>,
        );

        expect(wrapper.find('.btn-group')).toBeTruthy();
        expect(wrapper.find('.btn').length).toBe(3);
    });
});
