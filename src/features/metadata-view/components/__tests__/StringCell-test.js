import * as React from 'react';

import { stringCellData } from '../fixtures';
import StringCell from '../StringCell';

describe('features/metadata-view/components/StringCell', () => {
    test('should render', () => {
        const wrapper = shallow(<StringCell cellData={stringCellData} />);
        expect(wrapper).toMatchSnapshot();
    });
});
