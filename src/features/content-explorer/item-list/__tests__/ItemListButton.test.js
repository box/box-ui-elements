import React from 'react';

import ItemListButton from '../ItemListButton';
import ContentExplorerMode from '../../modes';

describe('features/content-explorer/item-list/ItemListButton', () => {
    describe('render()', () => {
        [
            // nonMultiSelectMode
            {
                contentExplorerMode: ContentExplorerMode.SELECT_FILE,
            },
            // multiSelectMode
            {
                contentExplorerMode: ContentExplorerMode.MULTI_SELECT,
            },
        ].forEach(({ contentExplorerMode }) => {
            const renderComponent = props =>
                shallow(<ItemListButton contentExplorerMode={contentExplorerMode} id="123" name="test" {...props} />);

            const buttonType = contentExplorerMode === ContentExplorerMode.MULTI_SELECT ? 'Checkbox' : 'RadioButton';

            test('should render default component', () => {
                const wrapper = renderComponent();

                expect(wrapper.find(buttonType).length).toBe(1);
                expect(wrapper.prop('label')).toBeTruthy();
                expect(wrapper.prop('value')).toEqual('123');
            });

            test('should render component with isDisabled when specified', () => {
                const wrapper = renderComponent({ isDisabled: true });

                expect(wrapper.find(buttonType).prop('isDisabled')).toBe(true);
            });

            test('should render component with isSelected when specified', () => {
                const wrapper = renderComponent({ isSelected: true });

                if (contentExplorerMode === ContentExplorerMode.MULTI_SELECT) {
                    expect(wrapper.find(buttonType).prop('isChecked')).toBe(true);
                } else {
                    expect(wrapper.find(buttonType).prop('isSelected')).toBe(true);
                }
            });

            test('should not render component with isSelected when both isDisabled and isSelected is true', () => {
                const wrapper = renderComponent({
                    isDisabled: true,
                    isSelected: true,
                });

                expect(wrapper.find(buttonType).prop('isDisabled')).toBe(true);

                if (contentExplorerMode === ContentExplorerMode.MULTI_SELECT) {
                    expect(wrapper.find(buttonType).prop('isChecked')).toBe(false);
                } else {
                    expect(wrapper.find(buttonType).prop('isSelected')).toBe(false);
                }
            });
        });
    });
});
