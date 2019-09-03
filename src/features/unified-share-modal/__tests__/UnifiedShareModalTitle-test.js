// @flow
import React from 'react';
import { shallow } from 'enzyme';

import UnifiedShareModalTitle from '../UnifiedShareModalTitle';

describe('features/unified-share-modal/HeaderTitle', () => {
    let wrapper;
    const defaultItem = {
        classification: 'internal',
        bannerPolicy: {
            body: 'test',
        },
        id: '111',
        name: 'test file',
        type: 'file',
        grantedPermissions: {
            itemShare: true,
        },
        hideCollaborators: false,
    };

    const getWrapper = (props = {}) => {
        return shallow(<UnifiedShareModalTitle item={defaultItem} {...props} />);
    };

    beforeEach(() => {
        wrapper = getWrapper();
    });

    test('should render classifiction label with title', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
