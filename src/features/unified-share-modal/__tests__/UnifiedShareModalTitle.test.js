// @flow
import React from 'react';
import { shallow } from 'enzyme';

import classificationColorsMap from '../../classification/classificationColorsMap';

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

    test('should not render classification label when canUserSeeClassification is false', () => {
        expect(wrapper.find('Classification')).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render classification label when canUserSeeClassification is true', () => {
        const itemWithSeeClassification = {
            ...defaultItem,
            canUserSeeClassification: true,
        };
        wrapper = shallow(<UnifiedShareModalTitle item={itemWithSeeClassification} />);
        expect(wrapper.find('Classification')).toHaveLength(1);
    });

    test('should render classification label with fill and stroke colors that match the classification color id', () => {
        const colorID = 3;
        const { color } = classificationColorsMap[colorID];

        const item = {
            ...defaultItem,
            canUserSeeClassification: true,
            bannerPolicy: { colorID },
        };

        wrapper = shallow(<UnifiedShareModalTitle item={item} />);
        expect(wrapper.find('Classification').props().color).toBe(color);
    });
});
