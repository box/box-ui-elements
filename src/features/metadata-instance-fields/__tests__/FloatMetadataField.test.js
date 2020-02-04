import React from 'react';

import FloatMetadataField from '../FloatMetadataField';

describe('features/metadata-instance-editor/fields/FloatMetadataField', () => {
    test('should correctly render a float field', () => {
        const wrapper = shallow(<FloatMetadataField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
});
