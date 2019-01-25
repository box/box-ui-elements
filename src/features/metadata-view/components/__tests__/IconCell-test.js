import * as React from 'react';

import IconCell from '../IconCell';

describe('features/metadata-view/components/IconCell', () => {
    test('should render', () => {
        const wrapper = shallow(<IconCell />);
        expect(wrapper).toMatchSnapshot();
    });
});
