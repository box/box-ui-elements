import React from 'react';
import { mount } from 'enzyme';
import Footer from '../Footer';

describe('elements/content-picker/Footer', () => {
    const defaultProps = {
        children: <div className="footer-child" />,
        currentCollection: { id: '123', name: 'Folder' },
        hasHitSelectionLimit: false,
        isSingleSelect: false,
        onCancel: () => {},
        onChoose: () => {},
        onSelectedClick: () => {},
        selectedCount: 0,
        selectedItems: [],
    };

    const getWrapper = props => mount(<Footer {...defaultProps} {...props} />);

    describe('render()', () => {
        test('should render Footer', () => {
            const wrapper = getWrapper();

            expect(wrapper.find('ButtonGroup').length).toBe(1);
            expect(wrapper.find('.footer-child').length).toBe(1);
        });

        test('should render Footer with custom action button', () => {
            const renderCustomActionButtons = jest.fn();

            const wrapper = getWrapper({
                renderCustomActionButtons: renderCustomActionButtons.mockReturnValue(<div className="custom-button" />),
            });

            expect(wrapper.find('.custom-button').length).toBe(1);
            expect(renderCustomActionButtons).toHaveBeenCalledWith({
                currentFolderId: defaultProps.currentCollection.id,
                currentFolderName: defaultProps.currentCollection.name,
                onCancel: defaultProps.onCancel,
                onChoose: defaultProps.onChoose,
                selectedCount: defaultProps.selectedCount,
                selectedItems: defaultProps.selectedItems,
            });
        });

        test.each`
            showSelectedButton | isSingleSelect | shown    | should
            ${false}           | ${false}       | ${false} | ${'should not show selected button'}
            ${false}           | ${true}        | ${false} | ${'should not show selected button'}
            ${true}            | ${false}       | ${true}  | ${'should show selected button'}
            ${true}            | ${true}        | ${false} | ${'should not show selected button'}
        `('$should', ({ isSingleSelect, shown, showSelectedButton }) => {
            const wrapper = getWrapper({ isSingleSelect, showSelectedButton });

            expect(wrapper.exists('.bcp-selected')).toBe(shown);
        });
    });
});
