import * as React from 'react';

import SkeletonItemList from '../components/SkeletonItemList';

describe('features/list-view/components/SkeletonItemList', () => {
    const getWrapper = props => {
        return shallow(<SkeletonItemList {...props} />);
    };

    test('should render', () => {
        const wrapper = getWrapper({ numberOfRows: 1 });
        expect(wrapper).toMatchSnapshot();
    });
});
