// @flow
import React from 'react';
import { shallow } from 'enzyme';

import routerLinkCellRenderer from '../routerLinkCellRenderer';

describe('features/react-virtualized-renderers/routerLinkCellRenderer', () => {
    let wrapper;
    let cellData;

    const getWrapper = (props = {}) => {
        return shallow(routerLinkCellRenderer(props));
    };

    beforeEach(() => {
        cellData = {
            label: 'label',
            to: 'to',
        };
        wrapper = getWrapper({ cellData });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should successfully render a Router Link Cell', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should render an icon when provided', () => {
        expect(wrapper.find('.VirtualizedTable-icon').length).toBe(0);

        cellData.icon = <span className="myicon">w00t</span>;
        wrapper = getWrapper({ cellData });

        expect(wrapper.find('.VirtualizedTable-icon').length).toBe(1);
        expect(wrapper.find('.myicon').length).toBe(1);
    });
});
