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
            const isDisabled = true;
            const onChange = jest.fn();
            const wrapper = renderComponent({ isDisabled, onChange });
            const toggle = wrapper.find('Toggle');

            expect(toggle.prop('onChange')).toBe(onChange);
            expect(toggle.prop('isDisabled')).toBe(isDisabled);
        });

        test('should render toggle label correctly', () => {
            const wrapper = renderComponent();
            const toggleLabelId = wrapper
                .find('Toggle')
                .dive()
                .find('FormattedMessage')
                .prop('id');

            expect(toggleLabelId).toBe('boxui.contentExplorer.includeSubfolders');
        });

        test('should render the info icon Tooltip based on value from tooltipMessage', () => {
            const tooltipMessage = { test: 'test' };
            const wrapper = renderComponent({ tooltipMessage });
            const expectedMessage = wrapper
                .find('Toggle')
                .dive()
                .find('Tooltip')
                .prop('text').props;

            expect(expectedMessage).toEqual(tooltipMessage);
        });
    });
});
