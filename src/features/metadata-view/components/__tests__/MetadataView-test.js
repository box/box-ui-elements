import * as React from 'react';

import MetadataView from '../../MetadataView';
import { visibleColumns, template, instances, metadataViewProps } from '../fixtures';

const { totalWidth, tableHeight, tableHeaderHeight, tableRowHeight, widths } = metadataViewProps;

describe('features/metadata-view/components/MetadataView', () => {
    const getWrapper = () => {
        return shallow(
            <MetadataView
                columnWidths={widths}
                filesList={template.filesList}
                instances={instances}
                tableHeaderHeight={tableHeaderHeight}
                tableHeight={tableHeight}
                tableRowHeight={tableRowHeight}
                template={template}
                templateName={template.templateName}
                totalWidth={totalWidth}
            />,
        );
    };
    test('should render', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('setColumnFilters()', () => {
        const wrapper = getWrapper();
        wrapper.instance().setColumnFilters(visibleColumns);
        expect(wrapper.state().visibleColumns).toEqual(visibleColumns);
    });

    test('generateColumnsFromFields()', () => {
        const wrapper = getWrapper();
        const generatedColumns = wrapper.instance().generateColumnsFromFields(template);
        generatedColumns.forEach(column => {
            expect.objectContaining({
                id: expect.any(String),
                label: expect.any(String),
                isChecked: expect.any(Boolean),
                key: expect.any(String),
            });
        });
    });
});
