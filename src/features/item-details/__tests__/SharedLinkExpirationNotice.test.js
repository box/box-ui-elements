import React from 'react';
import { FormattedDate } from 'react-intl';

import SharedLinkExpirationNotice from '../SharedLinkExpirationNotice';

describe('features/item-details/SharedLinkExpirationNotice', () => {
    const getWrapper = (props = {}) => shallow(<SharedLinkExpirationNotice expiration="May 27, 2018" {...props} />);

    test('should render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should accept node as expiration', () => {
        const wrapper = getWrapper({
            expiration: <FormattedDate value="1517533810845" />,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
