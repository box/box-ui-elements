// @flow
import React from 'react';
import { shallow } from 'enzyme';
import loadingRowRenderer from '../loadingRowRenderer';

describe('features/virtualized-table-renderers/loadingRowRenderer', () => {
    let rowRendererParams;

    beforeEach(() => {
        rowRendererParams = {
            className: 'ReactVirtualized__Table__row',
            columns: [
                <span key="1">
                    <span>Replace me 1</span>
                </span>,
                <span key="2">
                    <span>Replace me 2</span>
                </span>,
                <span key="3">
                    <span>Replace me 3</span>
                </span>,
            ],
            index: 3,
            isScrolling: false,
            key: '3-0',
            rowData: {
                name: 'name',
                owner: 'own',
                size: 'size',
            },
            style: {
                height: 52,
                left: 0,
                position: 'absolute',
                top: 156,
                width: 1083,
                overflow: 'hidden',
                paddingRight: 0,
            },
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should successfully render a row and replace cell content with loading state', () => {
        const wrapper = shallow(loadingRowRenderer(rowRendererParams));
        expect(wrapper).toMatchSnapshot();
    });
});
