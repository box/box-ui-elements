import * as React from 'react';

import { template } from '../components/fixtures';
import QueryBar from '../QueryBar';

describe('features/query-bar/components/QueryBar', () => {
    const getWrapper = props => {
        return shallow(<QueryBar {...props} />);
    };

    test('should render', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render when template is not selected', () => {
        const wrapper = getWrapper({
            templates: [template],
        });
        expect(wrapper).toMatchSnapshot();
    });
});
