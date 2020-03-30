import React from 'react';

import MultiSelectMetadataField from '../MultiSelectMetadataField';

describe('features/metadata-instance-editor/fields/MultiSelectMetadataField', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<MultiSelectMetadataField dataValue={['value']} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render with description', () => {
        const wrapper = shallow(<MultiSelectMetadataField dataValue={['value']} description="description" />);
        expect(wrapper).toMatchSnapshot();
    });
});
