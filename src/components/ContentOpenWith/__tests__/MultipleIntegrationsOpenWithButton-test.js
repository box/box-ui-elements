import React from 'react';
import { shallow } from 'enzyme';
import MultipleIntegrationsOpenWithButton from '../MultipleIntegrationsOpenWithButton';

describe('components/ContentOpenWith/MultipleIntegrationsOpenWithButton', () => {
    const getWrapper = props =>
        shallow(<MultipleIntegrationsOpenWithButton {...props} />);

    it('should render button', () => {
        const wrapper = getWrapper({});
        expect(wrapper).toMatchSnapshot();
    });

    it('should pass down props to the button', () => {
        const wrapper = getWrapper({ width: 50 });
        expect(wrapper).toMatchSnapshot();
    });
});
