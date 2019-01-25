import * as React from 'react';

import { enumCellData } from '../fixtures';

import EnumCell from '../EnumCell';

describe('features/metadata-view/components/EnumCell', () => {
    test('should render', () => {
        const wrapper = shallow(<EnumCell cellData={enumCellData} />);
        expect(wrapper).toMatchSnapshot();
    });
});
