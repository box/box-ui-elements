import React from 'react';

import { DateFieldBase as DateField } from '../DateField';

describe('features/metadata-instance-editor/fields/DateField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a date field', () => {
        const wrapper = shallow(<DateField dataValue="2018-06-13T00:00:00.000Z" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });
});
