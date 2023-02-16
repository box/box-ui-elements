import React from 'react';

import { ContentExplorerIncludeSubfoldersBase as ContentExplorerIncludeSubfolders } from '../ContentExplorerIncludeSubfolders';

describe('features/content-explorer/content-explorer/ContentExplorerIncludeSubfolders', () => {
    const renderComponent = props =>
        shallow(
            <ContentExplorerIncludeSubfolders
                intl={{
                    formatMessage: () => {},
                }}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render the default component', () => {
            const wrapper = renderComponent();
            const onIncludeSubfoldersToggle = jest.fn();
            const onSelectAllClick = jest.fn();
            const isSelectAllChecked = false;
            const isToggleDisabled = true;
            wrapper.setProps({
                onIncludeSubfoldersToggle,
                onSelectAllClick,
                isSelectAllChecked,
                isToggleDisabled,
            });
            const checkbox = wrapper.find('Checkbox');
            const toggle = wrapper.find('Toggle');

            expect(wrapper.is('div')).toBe(true);
            expect(checkbox.prop('onChange')).toEqual(onSelectAllClick);
            expect(toggle.prop('onChange')).toEqual(onIncludeSubfoldersToggle);
            expect(checkbox.prop('isChecked')).toEqual(isSelectAllChecked);
            expect(toggle.prop('isDisabled')).toEqual(isToggleDisabled);
        });

        test('should render toggle label correctly', () => {
            const wrapper = renderComponent();

            const toggle = wrapper.find('Toggle');

            const toggleLabelId = toggle.prop('label').props.id;

            expect(toggleLabelId).toEqual('boxui.contentExplorer.includeSubfolders');
        });

        test('should render checkbox Tooltip text correctly', () => {
            const wrapper = renderComponent();

            const checkboxTooltip = wrapper.find('Tooltip').at(1);

            const checkboxTooltipTextId = checkboxTooltip.prop('text').props.id;

            expect(checkboxTooltipTextId).toEqual('boxui.contentExplorer.selectAll');
        });

        test('should render the info icon Tooltip based on value from tooltipMessageForToggle', () => {
            const tooltipMessageForToggle = { test: 'test' };
            const wrapper = renderComponent();
            const numOfSelectedItems = 2;
            wrapper.setProps({ numOfSelectedItems, tooltipMessageForToggle });

            const toggleTooltip = wrapper.find('Tooltip').at(0);

            expect(toggleTooltip.prop('text').props).toEqual(tooltipMessageForToggle);
        });
    });
});
