import * as React from 'react';

import { integerCellData } from '../fixtures';

import IntegerCell from '../IntegerCell';

describe('features/metadata-view/components/IntegerCell', () => {
    test('should render', () => {
        const wrapper = shallow(<IntegerCell cellData={integerCellData} />);
        expect(wrapper).toMatchSnapshot();
    });
});
