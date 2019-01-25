import * as React from 'react';

import { floatCellData } from '../fixtures';

import FloatCell from '../FloatCell';

describe('features/metadata-view/components/FloatCell', () => {
    test('should render', () => {
        const wrapper = shallow(<FloatCell cellData={floatCellData} />);
        expect(wrapper).toMatchSnapshot();
    });
});
