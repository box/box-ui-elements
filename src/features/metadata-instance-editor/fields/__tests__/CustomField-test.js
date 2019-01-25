import React from 'react';

import { CustomFieldBase as CustomField } from '../CustomField';

describe('features/metadata-instance-editor/fields/CustomField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a custom field when editable', () => {
        const wrapper = shallow(<CustomField intl={intl} canEdit dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a custom field when not editable', () => {
        const wrapper = shallow(<CustomField intl={intl} dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a custom field is last', () => {
        const wrapper = shallow(<CustomField intl={intl} isLast dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
});
