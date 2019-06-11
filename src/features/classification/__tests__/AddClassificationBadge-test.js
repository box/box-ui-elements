// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';

import AddClassificationBadge from '../AddClassificationBadge';

describe('features/classification/AddClassificationBadge', () => {
    const getWrapper = (props = {}) => shallow(<AddClassificationBadge {...props} />);

    test('should render a classified badge with tooltip disabled', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
        const fm = wrapper.find(FormattedMessage);
        expect(fm.renderProp('children')('name')).toMatchSnapshot();
    });
});
