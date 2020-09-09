import React from 'react';

import ContentExplorerModal from '../ContentExplorerModal';

describe('features/content-explorer/content-explorer-modal/ContentExplorerModal', () => {
    const renderComponent = props =>
        shallow(
            <ContentExplorerModal
                isOpen
                contentExplorerMode="selectFile"
                initialFoldersPath={[]}
                onEnterFolder={() => {}}
                onSearchSubmit={() => {}}
                onExitSearch={() => {}}
                items={[]}
                numItemsPerPage={100}
                numTotalItems={100}
                onLoadMoreItems={() => {}}
                formatMessage={() => ''}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.hasClass('content-explorer-modal')).toBe(true);
            expect(wrapper.find('ContentExplorer').length).toBe(1);
        });

        test('should render component with class when specified', () => {
            const className = 'test';
            const wrapper = renderComponent({ className });

            expect(wrapper.hasClass('content-explorer-modal')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render component with title when specified', () => {
            const title = 'Title';
            const wrapper = renderComponent({ title });

            expect(wrapper.find('Modal').prop('title')).toEqual(title);
        });

        test('should render component with description when specified', () => {
            const description = 'Description';
            const wrapper = renderComponent({ description });

            expect(wrapper.contains(description)).toBe(true);
        });

        test('customInput should be undefined if nothing is passed in', () => {
            const wrapper = renderComponent();
            expect(wrapper.find('ContentExplorer').prop('customInput')).toEqual(undefined);
        });

        test('customInput should be contain a custom input if the prop is passed', () => {
            const customInput = () => <div>BLARGH TESTS</div>;
            const wrapper = renderComponent({ customInput });
            expect(wrapper.find('ContentExplorer').prop('customInput')).toEqual(customInput);
            expect(wrapper).toMatchSnapshot();
        });

        test('should pass onSelectedClick and onSelectItem to ContentExplorer', () => {
            const onSelectedClick = () => {};
            const onSelectItem = () => {};
            const wrapper = renderComponent({ onSelectedClick, onSelectItem });
            expect(wrapper.find('ContentExplorer').prop('onSelectedClick')).toEqual(onSelectedClick);
            expect(wrapper.find('ContentExplorer').prop('onSelectItem')).toEqual(onSelectItem);
        });
    });
});
