import React from 'react';

import { CustomFieldBase as CustomField } from '../CustomField';

describe('features/metadata-instance-editor/fields/CustomField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a custom field when editable', () => {
        const wrapper = shallow(<CustomField canEdit dataValue="value" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a custom field when not editable', () => {
        const wrapper = shallow(<CustomField dataValue="value" intl={intl} />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a custom field is last', () => {
        const wrapper = shallow(<CustomField dataValue="value" intl={intl} isLast />);
        expect(wrapper).toMatchSnapshot();
    });
});
