import React from 'react';
import { shallow } from 'enzyme';
import PrimaryButton from '..';
import Button from '../../button';

describe('components/primary-button/PrimaryButton', () => {
    test('should correctly render children in primary button', () => {
        const children = 'yooo';

        const wrapper = shallow(<PrimaryButton>{children}</PrimaryButton>);

        expect(wrapper.find(Button).length).toEqual(1);
        expect(wrapper.hasClass('btn-primary')).toBe(true);
        expect(wrapper.contains(children)).toBe(true);
    });
});
