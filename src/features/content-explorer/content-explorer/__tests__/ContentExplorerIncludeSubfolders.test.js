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
            const handleIncludeSubfoldersToggle = jest.fn();
            const handleSelectAllClick = jest.fn();
            const isSelectAllChecked = false;
            const toggleIsDisabled = true;
            wrapper.setProps({
                handleIncludeSubfoldersToggle,
                handleSelectAllClick,
                isSelectAllChecked,
                toggleIsDisabled,
            });
            const checkbox = wrapper.find('Checkbox');
            const toggle = wrapper.find('Toggle');

            expect(wrapper.is('div')).toBe(true);
            expect(checkbox.prop('onChange')).toEqual(handleSelectAllClick);
            expect(toggle.prop('onChange')).toEqual(handleIncludeSubfoldersToggle);
            expect(checkbox.prop('isChecked')).toEqual(isSelectAllChecked);
            expect(toggle.prop('isDisabled')).toEqual(toggleIsDisabled);
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

        test('should render checkbox with extra padding if the vertical scrollbar is present', () => {
            const isVerticalScrollBarPresent = true;
            const wrapper = renderComponent();
            wrapper.setProps({ isVerticalScrollBarPresent });

            const checkbox = wrapper.find('Checkbox');

            const checkboxClassname = checkbox.prop('className');

            expect(checkboxClassname).toEqual(
                'content-explorer-include-subfolders-select-all-scrollbar-padded-checkbox',
            );
        });

        test('should render checkbox without extra padding if the vertical scrollbar is not present', () => {
            const isVerticalScrollBarPresent = false;
            const wrapper = renderComponent();
            wrapper.setProps({ isVerticalScrollBarPresent });

            const checkbox = wrapper.find('Checkbox');

            const checkboxClassname = checkbox.prop('className');

            expect(checkboxClassname).toEqual('content-explorer-include-subfolders-select-all-checkbox');
        });

        test('should render the correct info icon Tooltip when there are more than 1 item selected', () => {
            const wrapper = renderComponent();
            const numOfSelectedItems = 2;
            wrapper.setProps({ numOfSelectedItems });

            const toggleTooltip = wrapper.find('Tooltip').at(0);

            const toggleTooltipTextId = toggleTooltip.prop('text').props.id;

            expect(toggleTooltipTextId).toEqual('boxui.contentExplorer.includeSubfoldersMultipleFoldersSelected');
        });

        test('should render the correct info icon Tooltip when the selected item is not a folder', () => {
            const wrapper = renderComponent();
            const noFoldersSelected = true;
            const numOfSelectedItems = 1;
            wrapper.setProps({ noFoldersSelected, numOfSelectedItems });

            const toggleTooltip = wrapper.find('Tooltip').at(0);

            const toggleTooltipTextId = toggleTooltip.prop('text').props.id;

            expect(toggleTooltipTextId).toEqual('boxui.contentExplorer.includeSubfoldersNoFoldersSelected');
        });

        test('should render the correct info icon Tooltip when there are no folders present and we have not selected anything yet', () => {
            const wrapper = renderComponent();
            const foldersPresent = false;
            const numOfSelectedItems = 0;
            wrapper.setProps({ foldersPresent, numOfSelectedItems });

            const toggleTooltip = wrapper.find('Tooltip').at(0);

            const toggleTooltipTextId = toggleTooltip.prop('text').props.id;

            expect(toggleTooltipTextId).toEqual('boxui.contentExplorer.includeSubfoldersNoFoldersToSelect');
        });

        test('should render the correct info icon Tooltip when the tooltip should be enabled and working', () => {
            const wrapper = renderComponent();
            const noFoldersSelected = false;
            const numOfSelectedItems = 1;
            wrapper.setProps({ noFoldersSelected, numOfSelectedItems });

            const toggleTooltip = wrapper.find('Tooltip').at(0);

            const toggleTooltipTextId = toggleTooltip.prop('text').props.id;

            expect(toggleTooltipTextId).toEqual('boxui.contentExplorer.includeSubfoldersDefaultInformation');
        });
    });
});
