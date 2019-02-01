import React from 'react';

import { EnumFieldBase as EnumField } from '../EnumField';

describe('features/metadata-instance-editor/fields/EnumField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render an enum field', () => {
        const wrapper = shallow(
            <EnumField dataValue="value" intl={intl} options={[{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }]} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an enum field with description', () => {
        const wrapper = shallow(
            <EnumField
                dataValue="value"
                description="description"
                intl={intl}
                options={[{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }]}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
