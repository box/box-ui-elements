import * as React from 'react';

import {
    columnForTemplateFieldName,
    columns,
    columnsWithoutItems,
    columnsWithPropertyName,
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

    test('should render ColumnButton with columns that does not include property: "name" and source: "metadata"', () => {
        const wrapper = getWrapper({
            columns: columnsWithPropertyName,
        });
        const ColumnButton = wrapper.find('ColumnButton');
        expect(ColumnButton.props().columns).toEqual([columnForTemplateFieldName]);
    });

    test('should render FilterButton with columns without items', () => {
        const wrapper = getWrapper({
            columns,
        });
        const FilterButton = wrapper.find('FilterButton');
        expect(FilterButton.props().columns).toEqual(columnsWithoutItems);
    });
});
