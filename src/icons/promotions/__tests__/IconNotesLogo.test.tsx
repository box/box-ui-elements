import React from 'react';
import { shallow } from 'enzyme';
import IconNotesLogo from '../IconNotesLogo';

describe('icons/promotions/IconNotesLogo', () => {
    const getWrapper = (props = {}) => shallow(<IconNotesLogo {...props} />);

    test('should correctly render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render component with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            color: '#FEDCBA',
            height: 100,
            title: 'title',
            width: 200,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
