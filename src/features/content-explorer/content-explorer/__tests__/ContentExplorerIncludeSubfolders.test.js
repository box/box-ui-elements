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
            const onChange = jest.fn();
            const isDisabled = true;
            wrapper.setProps({
                onChange,
                isDisabled,
            });
            const toggle = wrapper.find('Toggle');

            expect(wrapper.is('div')).toBe(true);
            expect(toggle.prop('onChange')).toEqual(onChange);
            expect(toggle.prop('isDisabled')).toEqual(isDisabled);
        });

        test('should render toggle label correctly', () => {
            const wrapper = renderComponent();

            const toggle = wrapper.find('Toggle');

            const toggleLabelId = toggle.prop('label').props.id;

            expect(toggleLabelId).toEqual('boxui.contentExplorer.includeSubfolders');
        });

        test('should render the info icon Tooltip based on value from tooltipMessage', () => {
            const tooltipMessage = { test: 'test' };
            const wrapper = renderComponent();
            const numOfSelectedItems = 2;
            wrapper.setProps({ numOfSelectedItems, tooltipMessage });

            const toggleTooltip = wrapper.find('Tooltip').at(0);

            expect(toggleTooltip.prop('text').props).toEqual(tooltipMessage);
        });
    });
});
