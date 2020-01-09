import React from 'react';
import { shallow } from 'enzyme';
import IntegrationPortalContainer from '../IntegrationPortalContainer';

describe('elements/content-open-with/IntegrationPortalContainer', () => {
    const getWrapper = props => shallow(<IntegrationPortalContainer {...props} />);
    it('should render an error mask if an error occurs', () => {
        const wrapper = getWrapper({
            hasError: true,
            integrationWindow: 'window',
        });

        expect(wrapper).toMatchSnapshot();
    });
    it('should render a loading indicator', () => {
        const wrapper = getWrapper({
            hasError: false,
            integrationWindow: 'window',
        });

        expect(wrapper).toMatchSnapshot();
    });
});
