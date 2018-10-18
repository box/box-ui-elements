import React from 'react';
import { shallow } from 'enzyme';
import OpenWithButtonContents from '../OpenWithButtonContents';
import IconOpenWith from 'box-react-ui/lib/icons/general/IconOpenWith';

describe('components/ContentOpenWith/MultipleIntegrationsOpenWithButton', () => {
    const getWrapper = props => shallow(<OpenWithButtonContents {...props} />);

    it('should render contents', () => {
        const wrapper = getWrapper({});
        expect(wrapper).toMatchSnapshot();
    });

    it('should render children if provided', () => {
        const wrapper = getWrapper({ children: <IconOpenWith /> });
        expect(wrapper).toMatchSnapshot();
    });
});
