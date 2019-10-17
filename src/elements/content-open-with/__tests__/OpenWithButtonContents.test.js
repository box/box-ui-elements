import React from 'react';
import { shallow } from 'enzyme';
import IconOpenWith from '../../../icons/general/IconOpenWith';
import OpenWithButtonContents from '../OpenWithButtonContents';

describe('elements/content-open-with/MultipleIntegrationsOpenWithButton', () => {
    const getWrapper = props => shallow(<OpenWithButtonContents {...props} />);

    test('should render contents', () => {
        const wrapper = getWrapper({});
        expect(wrapper).toMatchSnapshot();
    });

    test('should render children if provided', () => {
        const wrapper = getWrapper({ children: <IconOpenWith /> });
        expect(wrapper).toMatchSnapshot();
    });
});
