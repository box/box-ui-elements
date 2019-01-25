import React from 'react';

import { TextFieldBase as TextField } from '../TextField';

describe('features/metadata-instance-editor/fields/TextField', () => {
    const intl = {
        formatMessage: jest.fn(),
    };

    test('should correctly render a text field', () => {
        const wrapper = shallow(<TextField intl={intl} dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a number field', () => {
        const wrapper = shallow(<TextField intl={intl} dataValue="value" type="number" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render a zero in a number field', () => {
        const wrapper = shallow(<TextField intl={intl} dataValue={0} type="number" />);
        expect(wrapper).toMatchSnapshot();
    });
});
