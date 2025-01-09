import * as React from 'react';
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

        test('should render footer with disabled button', () => {
            const buttons = getWrapper().find('Button');
            const chooseButton = buttons.at(1);

            // https://www.w3.org/WAI/ARIA/apg/patterns/button/
            // When the action associated with a button is unavailable, the button has aria-disabled set to true.
            expect(chooseButton.html().includes('aria-disabled')).toBe(true);
            expect(chooseButton.prop('disabled')).toBe(true);
        });

        test('should render Footer buttons with aria-label', () => {
            const buttons = getWrapper().find('Button');

            expect(buttons.at(0).prop('aria-label')).toBe('Cancel');
            expect(buttons.at(1).prop('aria-label')).toBe('Choose');
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
