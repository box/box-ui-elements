// @flow
import * as React from 'react';

import RemoveButton from '../RemoveButton';

describe('feature/left-sidebar/features/RemoveButton', () => {
    test('should render', () => {
        const onClickRemove = () => {};
        const wrapper = shallow(<RemoveButton onClickRemove={onClickRemove} />);

        expect(wrapper).toMatchSnapshot();
    });
});
