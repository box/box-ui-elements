import React from 'react';

import FloatField from '../FloatField';

describe('features/metadata-instance-editor/fields/FloatField', () => {
    test('should correctly render a float field', () => {
        const wrapper = shallow(<FloatField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
});
