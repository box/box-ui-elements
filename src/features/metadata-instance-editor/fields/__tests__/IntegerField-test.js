import React from 'react';

import IntegerField from '../IntegerField';

describe('features/metadata-instance-editor/fields/IntegerField', () => {
    test('should correctly render an integer field', () => {
        const wrapper = shallow(<IntegerField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
});
