import React from 'react';

import EmptyContent from '../EmptyContent';

describe('features/metadata-instance-editor/EmptyContent', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<EmptyContent />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render edit mode when canAdd is passed', () => {
        const wrapper = shallow(<EmptyContent canAdd />);
        expect(wrapper).toMatchSnapshot();
    });
});
