import React from 'react';

import IntegerMetadataField from '../IntegerMetadataField';

describe('features/metadata-instance-editor/fields/IntegerMetadataField', () => {
    test('should correctly render an integer field', () => {
        const wrapper = shallow(<IntegerMetadataField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
});
