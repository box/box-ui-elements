import React from 'react';

import { CustomMetadataFieldBase as CustomMetadataField } from '../CustomMetadataField';

describe('features/metadata-instance-editor/fields/CustomMetadataField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a custom field when editable', () => {
        const wrapper = shallow(<CustomMetadataField canEdit dataValue="value" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a custom field when not editable', () => {
        const wrapper = shallow(<CustomMetadataField dataValue="value" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a custom field is last', () => {
        const wrapper = shallow(<CustomMetadataField dataValue="value" intl={intl} isLast />);
        expect(wrapper).toMatchSnapshot();
    });
});
