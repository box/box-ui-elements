import React from 'react';
import { FormattedDate } from 'react-intl';

import ItemExpirationNotice from '../ItemExpirationNotice';

describe('features/item-details/ItemExpirationNotice', () => {
    const getWrapper = (props = {}) =>
        shallow(<ItemExpirationNotice expiration="May 27, 2018" itemType="file" {...props} />);

    [
        {
            itemType: 'file',
        },
        {
            itemType: 'folder',
        },
        {
            itemType: 'web_link',
        },
    ].forEach(({ itemType }) => {
        test('should render default component', () => {
            const wrapper = getWrapper({ itemType });

            expect(wrapper).toMatchSnapshot();
        });
    });

    test('should accept node as expiration', () => {
        const wrapper = getWrapper({
            expiration: <FormattedDate value="1517533810845" />,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
