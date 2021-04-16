import React from 'react';
import sinon from 'sinon';

import { ContentExplorerSelectAllBase as ContentExplorerSelectAll } from '../ContentExplorerSelectAll';

describe('features/content-explorer/content-explorer/ContentExplorerSelectAll', () => {
    const sandbox = sinon.sandbox.create();

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

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render the default component', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();

            expect(wrapper.is('div')).toBe(true);
            expect(wrapper.find('Checkbox').prop('onChange')).toEqual(instance.handleSelectAllClick);
            expect(wrapper.find('Checkbox').prop('isChecked')).toEqual(instance.isSelectAllChecked);
        });

        test('should render checkbox label correct', () => {
            const wrapper = renderComponent();

            expect(
                wrapper
                    .find('label')
                    .at(1)
                    .find('FormattedMessage')
                    .props().id,
            ).toEqual('boxui.contentExplorer.selectAll');
        });

        test('should render items count correct', () => {
            const numTotalItems = 12345;
            const wrapper = renderComponent({ numTotalItems });

            expect(
                wrapper
                    .find('label')
                    .at(0)
                    .find('FormattedMessage')
                    .props().id,
            ).toEqual('boxui.contentExplorer.results');
            expect(
                wrapper
                    .find('label')
                    .at(0)
                    .find('FormattedMessage')
                    .props().values.itemsCount,
            ).toEqual(numTotalItems);
        });
    });
});
