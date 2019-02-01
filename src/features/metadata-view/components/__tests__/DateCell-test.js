import * as React from 'react';

import { dateCellData } from '../fixtures';

import DateCell from '../DateCell';

const intlShape = {
    formatDate: () => 'February 2016',
};

describe('features/metadata-view/components/DateCell', () => {
    test('should render', () => {
        const wrapper = shallow(<DateCell cellData={dateCellData} intl={intlShape} />);
        expect(wrapper).toMatchSnapshot();
    });
});
