import * as React from 'react';

import { nameCellData } from '../fixtures';
import NameCell from '../NameCell';

describe('features/metadata-view/components/NameCell', () => {
    test('should render', () => {
        const wrapper = shallow(<NameCell cellData={nameCellData} />);
        expect(wrapper).toMatchSnapshot();
    });
});
