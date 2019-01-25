import * as React from 'react';

import { multiSelectCellData } from '../fixtures';
import MultiSelectCell from '../MultiSelectCell';

describe('features/metadata-view/components/MultiSelectCell', () => {
    test('should render', () => {
        const wrapper = shallow(<MultiSelectCell cellData={multiSelectCellData} />);
        expect(wrapper).toMatchSnapshot();
    });
});
