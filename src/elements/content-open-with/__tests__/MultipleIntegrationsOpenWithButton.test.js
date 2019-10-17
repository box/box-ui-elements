import React from 'react';
import { shallow } from 'enzyme';
import MultipleIntegrationsOpenWithButton from '../MultipleIntegrationsOpenWithButton';

describe('elements/content-open-with/MultipleIntegrationsOpenWithButton', () => {
    const getWrapper = props => shallow(<MultipleIntegrationsOpenWithButton {...props} />);

    test('should render button', () => {
        const wrapper = getWrapper({});
        expect(wrapper).toMatchSnapshot();
    });

    test('should pass down props to the button', () => {
        const wrapper = getWrapper({ width: 50 });
        expect(wrapper).toMatchSnapshot();
    });
});
