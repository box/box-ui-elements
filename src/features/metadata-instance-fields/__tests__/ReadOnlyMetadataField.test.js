import React from 'react';

import ReadOnlyMetadataField from '../ReadOnlyMetadataField';

describe('features/metadata-instance-editor/fields/ReadOnlyMetadataField', () => {
    test('should correctly render a string field', () => {
        const wrapper = shallow(<ReadOnlyMetadataField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a date field', () => {
        const wrapper = shallow(<ReadOnlyMetadataField dataValue="2018-06-13T00:00:00.000Z" type="date" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render with description', () => {
        const wrapper = shallow(<ReadOnlyMetadataField dataValue="value" description="description" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render multi select field', () => {
        const wrapper = shallow(<ReadOnlyMetadataField dataValue={['value']} description="description" />);
        expect(wrapper).toMatchSnapshot();
    });
});
