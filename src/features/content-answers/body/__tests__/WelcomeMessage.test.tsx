import React from 'react';
import { shallow } from 'enzyme';

import WelcomeMessage from '../WelcomeMessage';

describe('features/content-answers/body/WelcomeMessage', () => {
    const getWrapper = (props: {}) => {
        return shallow(<WelcomeMessage fileName="" {...props} />);
    };

    test('should render correctly without filename', () => {
        const wrapper = getWrapper({});
        expect(wrapper).toMatchSnapshot();
    });

    test('should render correct filename', () => {
        const wrapper = getWrapper({ fileName: 'test' });
        expect(wrapper).toMatchSnapshot();
    });
});
