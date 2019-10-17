import React from 'react';

import MultiSelectField from '../MultiSelectField';

describe('features/metadata-instance-editor/fields/MultiSelectField', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<MultiSelectField dataValue={['value']} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render with description', () => {
        const wrapper = shallow(<MultiSelectField dataValue={['value']} description="description" />);
        expect(wrapper).toMatchSnapshot();
    });
});
