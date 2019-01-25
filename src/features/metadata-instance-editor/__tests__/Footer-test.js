import React from 'react';

import Footer from '../Footer';

describe('features/metadata-instance-editor/fields/Footer', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<Footer />);
        expect(wrapper).toMatchSnapshot();
    });
});
