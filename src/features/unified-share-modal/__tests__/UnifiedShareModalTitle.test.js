// @flow
import React from 'react';
import { shallow } from 'enzyme';

import UnifiedShareModalTitle from '../UnifiedShareModalTitle';

describe('features/unified-share-modal/HeaderTitle', () => {
    let wrapper;
    const defaultItem = {
        canUserSeeClassification: false,
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

    test('should not render classifiction label when canUserSeeClassification is false', () => {
        expect(wrapper.find('Classification').length).toBe(0);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render classifiction label when canUserSeeClassification is true', () => {
        const itemWithSeeClassification = {
            ...defaultItem,
            canUserSeeClassification: true,
        };
        wrapper = shallow(<UnifiedShareModalTitle item={itemWithSeeClassification} />);
        expect(wrapper.find('Classification').length).toBe(1);
    });
});
