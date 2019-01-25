import React from 'react';

import ReadOnlyField from '../ReadOnlyField';

describe('features/metadata-instance-editor/fields/ReadOnlyField', () => {
    test('should correctly render a string field', () => {
        const wrapper = shallow(<ReadOnlyField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a date field', () => {
        const wrapper = shallow(<ReadOnlyField dataValue="2018-06-13T00:00:00.000Z" type="date" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render with description', () => {
        const wrapper = shallow(<ReadOnlyField dataValue="value" description="description" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render multi select field', () => {
        const wrapper = shallow(<ReadOnlyField dataValue={['value']} description="description" />);
        expect(wrapper).toMatchSnapshot();
    });
});
