import React from 'react';

import { TextMetadataFieldBase as TextMetadataField } from '../TextMetadataField';

describe('features/metadata-instance-editor/fields/TextMetadataField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a text field', () => {
        const wrapper = shallow(<TextMetadataField dataValue="value" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a number field', () => {
        const wrapper = shallow(<TextMetadataField dataValue="value" intl={intl} type="number" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a zero in a number field', () => {
        const wrapper = shallow(<TextMetadataField dataValue={0} intl={intl} type="number" />);
        expect(wrapper).toMatchSnapshot();
    });
});
