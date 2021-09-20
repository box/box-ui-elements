import React from 'react';

import { ContentExplorerSelectAllBase as ContentExplorerSelectAll } from '../ContentExplorerSelectAll';

describe('features/content-explorer/content-explorer/ContentExplorerSelectAll', () => {
    const renderComponent = props =>
        shallow(
            <ContentExplorerSelectAll
                intl={{
                    formatMessage: () => {},
                    formatNumber: x => {
                        return x;
                    },
                }}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render the default component', () => {
            const wrapper = renderComponent();
            const handleSelectAllClick = jest.fn();
            const isSelectAllChecked = true;
            wrapper.setProps({ handleSelectAllClick, isSelectAllChecked });
            const checkbox = wrapper.find('Checkbox');

            expect(wrapper.is('div')).toBe(true);
            expect(wrapper.find('Checkbox').prop('onChange')).toEqual(handleSelectAllClick);
            expect(checkbox.prop('isChecked')).toEqual(isSelectAllChecked);
        });

        test('should render checkbox label correctly', () => {
            const wrapper = renderComponent();

            expect(
                wrapper
                    .find('label')
                    .at(1)
                    .find('FormattedMessage')
                    .props().id,
            ).toEqual('boxui.contentExplorer.selectAll');
        });

        test('should render items count correctly when result !== 1', () => {
            const numTotalItems = 12345;
            const wrapper = renderComponent({ numTotalItems });
            const itemsCountLabel = wrapper
                .find('label')
                .at(0)
                .find('FormattedMessage');
            expect(itemsCountLabel.props().id).toEqual('boxui.contentExplorer.results');
            expect(itemsCountLabel.props().values.itemsCount).toEqual(numTotalItems);
        });

        test('should render items count correctly when result === 1', () => {
            const numTotalItems = 1;
            const wrapper = renderComponent({ numTotalItems });
            const itemsCountLabel = wrapper
                .find('label')
                .at(0)
                .find('FormattedMessage');
            expect(itemsCountLabel.props().id).toEqual('boxui.contentExplorer.result');
            expect(itemsCountLabel.props().values.itemsCount).toEqual(numTotalItems);
        });
    });
});
