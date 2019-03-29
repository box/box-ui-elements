import * as React from 'react';

import {
    columnForTemplateFieldName,
    columns,
    metadataColumns,
    columnsWithTemplateFieldName,
    template,
} from '../components/fixtures';
import QueryBar from '../QueryBar';

describe('features/query-bar/components/QueryBar', () => {
    const getWrapper = props => {
        return shallow(<QueryBar {...props} />);
    };

    test('should render', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render when template is not selected', () => {
        const wrapper = getWrapper({
            templates: [template],
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render ColumnButton with columns that do not include item name', () => {
        const wrapper = getWrapper({
            columns: columnsWithTemplateFieldName,
        });
        const ColumnButton = wrapper.find('ColumnButton');
        expect(ColumnButton.props().columns).toEqual([columnForTemplateFieldName]);
    });

    test('should render FilterButton with metadata columns', () => {
        const wrapper = getWrapper({
            columns,
        });
        const FilterButton = wrapper.find('FilterButton');
        expect(FilterButton.props().columns).toEqual(metadataColumns);
    });
});
