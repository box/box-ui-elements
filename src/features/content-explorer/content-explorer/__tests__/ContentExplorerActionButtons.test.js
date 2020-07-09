import React from 'react';
import sinon from 'sinon';

import ContentExplorerActionButtons, { getChosenItemsFromSelectedItems } from '../ContentExplorerActionButtons';
import ContentExplorerModes from '../../modes';

describe('features/content-explorer/content-explorer/ContentExplorerActionButtons', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props => shallow(<ContentExplorerActionButtons {...props} />);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        [
            // select file
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FILE,
                hasChooseButton: true,
                hasMoveButton: false,
                hasCopyButton: false,
            },
            // select folder
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
                hasChooseButton: true,
                hasMoveButton: false,
                hasCopyButton: false,
            },
            // move copy
            {
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
                hasChooseButton: false,
                hasMoveButton: true,
                hasCopyButton: true,
            },
            // multi select
            {
                contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
                hasChooseButton: true,
                hasMoveButton: false,
                hasCopyButton: false,
            },
        ].forEach(({ contentExplorerMode, hasChooseButton, hasMoveButton, hasCopyButton }) => {
            test('should render correct buttons based on the specified contentExplorerMode', () => {
                const wrapper = renderComponent({
                    contentExplorerMode,
                    selectedItems: {},
                });
                expect(wrapper.find('.content-explorer-choose-button').length).toBe(hasChooseButton ? 1 : 0);
                expect(wrapper.find('.content-explorer-move-button').length).toBe(hasMoveButton ? 1 : 0);
                expect(wrapper.find('.content-explorer-copy-button').length).toBe(hasCopyButton ? 1 : 0);
            });

            test('should render disabled buttons when areButtonsDisabled is true', () => {
                const wrapper = renderComponent({
                    contentExplorerMode,
                    areButtonsDisabled: true,
                    selectedItems: {},
                });
                if (hasChooseButton) {
                    expect(wrapper.find('.content-explorer-choose-button').prop('isDisabled')).toBe(true);
                }
                if (hasMoveButton) {
                    expect(wrapper.find('.content-explorer-move-button').prop('isDisabled')).toBe(true);
                }
                if (hasCopyButton) {
                    expect(wrapper.find('.content-explorer-copy-button').prop('isDisabled')).toBe(true);
                }
            });
        });

        test('should disable and set buttons to loading when isChooseButtonLoading is true', () => {
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
                isChooseButtonLoading: true,
                selectedItems: {},
            });
            const chooseButton = wrapper.find('.content-explorer-choose-button');

            expect(wrapper.find('.content-explorer-cancel-button').prop('isDisabled')).toBe(true);
            expect(chooseButton.prop('isDisabled')).toBe(true);
            expect(chooseButton.prop('isLoading')).toBe(true);
        });

        test('should disable buttons and set move button to loading when isMoveButtonLoading is true', () => {
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
                isMoveButtonLoading: true,
                selectedItems: {},
            });

            expect(wrapper.find('.content-explorer-cancel-button').prop('isDisabled')).toBe(true);

            const moveBtn = wrapper.find('.content-explorer-move-button');
            expect(moveBtn.prop('isDisabled')).toBe(true);
            expect(moveBtn.prop('isLoading')).toBe(true);

            expect(wrapper.find('.content-explorer-copy-button').prop('isDisabled')).toBe(true);
        });

        test('should disable buttons and set copy button to loading when isCopyButtonLoading is true', () => {
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
                isCopyButtonLoading: true,
                selectedItems: {},
            });

            expect(wrapper.find('.content-explorer-cancel-button').prop('isDisabled')).toBe(true);

            const copyBtn = wrapper.find('.content-explorer-copy-button');
            expect(copyBtn.prop('isDisabled')).toBe(true);
            expect(copyBtn.prop('isLoading')).toBe(true);

            expect(wrapper.find('.content-explorer-move-button').prop('isDisabled')).toBe(true);
        });

        test('should render custom choose button text when specified', () => {
            const chooseButtonText = 'Test';
            const wrapper = renderComponent({
                chooseButtonText,
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
                selectedItems: {},
            });

            expect(wrapper.find('.content-explorer-choose-button').contains(chooseButtonText)).toBe(true);
        });

        test('should set custom action buttons props when specified', () => {
            const wrapper = renderComponent({
                actionButtonsProps: { 'data-resin-feature': 'interactions' },
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
                selectedItems: {},
            });
            expect(wrapper.prop('data-resin-feature')).toEqual('interactions');
        });

        test('should set custom cancel button props when specified', () => {
            const wrapper = renderComponent({
                cancelButtonProps: { 'data-resin-target': 'cancel' },
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
                selectedItems: {},
            });
            expect(wrapper.find('.content-explorer-cancel-button').prop('data-resin-target')).toEqual('cancel');
        });

        test('should set custom chooose button props when specified', () => {
            const wrapper = renderComponent({
                chooseButtonProps: { 'data-resin-target': 'choose' },
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
                selectedItems: {},
            });
            expect(wrapper.find('.content-explorer-choose-button').prop('data-resin-target')).toEqual('choose');
        });
    });

    describe('onCancelClick', () => {
        test('should call onCancelClick when cancel button is clicked', () => {
            const onCancelClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.SELECT_FILE,
                onCancelClick: onCancelClickSpy,
                selectedItems: {},
            });

            wrapper.find('.content-explorer-cancel-button').simulate('click');

            expect(onCancelClickSpy.calledOnce).toBe(true);
        });
    });

    describe('onChooseClick', () => {
        [
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FILE,
            },
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
            },
            {
                contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
            },
        ].forEach(({ contentExplorerMode }) => {
            test('should call onChooseClick with selected items when choose button is clicked', () => {
                const item = { id: '0', name: 'item1' };
                const itemWithIsActionDisabled = {
                    id: '1',
                    name: 'item1',
                    isActionDisabled: true,
                };
                const anotherItem = { id: '2', name: 'item2' };
                const selectedItems = {
                    '0': item,
                    '1': itemWithIsActionDisabled,
                    '2': anotherItem,
                };
                const onChooseClickSpy = sandbox.spy();
                const wrapper = renderComponent({
                    contentExplorerMode,
                    selectedItems,
                    onChooseClick: onChooseClickSpy,
                });

                wrapper.find('.content-explorer-choose-button').simulate('click');

                expect(onChooseClickSpy.withArgs([item, anotherItem]).calledOnce).toBe(true);
            });
        });

        test('should call onChooseItem with the current folder when clicking the choose button and contentExplorerMode is selectFolder', () => {
            const currentFolder = { id: '0', name: 'item1' };
            const onChooseClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
                currentFolder,
                onChooseClick: onChooseClickSpy,
                selectedItems: {},
            });

            wrapper.find('.content-explorer-choose-button').simulate('click');

            expect(onChooseClickSpy.withArgs([currentFolder]).calledOnce).toBe(true);
        });
    });

    describe('onMoveClick', () => {
        test('should call onMoveClick with selected items when move button is clicked', () => {
            const item = { id: '0', name: 'item1' };
            const selectedItems = { '0': item };
            const onMoveClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
                selectedItems,
                onMoveClick: onMoveClickSpy,
            });

            wrapper.find('.content-explorer-move-button').simulate('click');

            expect(onMoveClickSpy.withArgs(item).calledOnce).toBe(true);
        });

        test('should call onMoveClick with current folder when move button is clicked and no item is selected', () => {
            const currentFolder = { id: '0', name: 'item1', type: 'folder' };
            const onMoveClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
                currentFolder,
                onMoveClick: onMoveClickSpy,
                selectedItems: {},
            });

            wrapper.find('.content-explorer-move-button').simulate('click');

            expect(onMoveClickSpy.withArgs(currentFolder).calledOnce).toBe(true);
        });
    });

    describe('onCopyClick', () => {
        test('should call onCopyClick with selected item when copy button is clicked', () => {
            const item = { id: '0', name: 'item1' };
            const selectedItems = { '0': item };
            const onCopyClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
                selectedItems,
                onCopyClick: onCopyClickSpy,
            });

            wrapper.find('.content-explorer-copy-button').simulate('click');

            expect(onCopyClickSpy.withArgs(item).calledOnce).toBe(true);
        });

        test('should call onCopyClick with current folder when when copy button is clicked and no item is selected', () => {
            const currentFolder = { id: '0', name: 'item1', type: 'folder' };
            const onCopyClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
                currentFolder,
                onCopyClick: onCopyClickSpy,
                selectedItems: {},
            });

            wrapper.find('.content-explorer-copy-button').simulate('click');

            expect(onCopyClickSpy.withArgs(currentFolder).calledOnce).toBe(true);
        });
    });

    describe('renderStatus', () => {
        test('should show status message for multi select', () => {
            const item = { id: '0', name: 'item1' };
            const selectedItems = { '0': item };
            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
                selectedItems,
            });

            expect(wrapper.find('.status-message').length).toEqual(1);
        });
        [
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FILE,
            },
            {
                contentExplorerMode: ContentExplorerModes.SELECT_FOLDER,
            },
            {
                contentExplorerMode: ContentExplorerModes.MOVE_COPY,
            },
        ].forEach(({ contentExplorerMode }) => {
            test('should not show status message', () => {
                const item = { id: '0', name: 'item1' };
                const selectedItems = { '0': item };
                const wrapper = renderComponent({
                    contentExplorerMode,
                    selectedItems,
                });

                expect(wrapper.find('.status-message').length).toEqual(0);
            });
        });

        test('should render statusElement as button when onSelectedClick provided for multi select', () => {
            const item = { id: '0', name: 'item1' };
            const selectedItems = { '0': item };
            const onSelectedClick = () => {};

            const wrapper = renderComponent({
                contentExplorerMode: ContentExplorerModes.MULTI_SELECT,
                selectedItems,
            });
            expect(wrapper.find('Button.status-message').length).toEqual(0);
            expect(wrapper.find('.status-message').length).toEqual(1);

            wrapper.setProps({ onSelectedClick });
            expect(wrapper.find('Button.status-message').length).toEqual(1);
        });
    });

    describe('getChosenItemsFromSelectedItems', () => {
        const item = { id: '0', name: 'item' };
        const isActionDisabledItem = {
            id: '1',
            name: 'item1',
            isActionDisabled: true,
        };
        [
            {
                selectedItems: { '0': item, '1': isActionDisabledItem },
                expectedChosenItemCount: 1,
            },
            {
                selectedItems: {},
                expectedChosenItemCount: 0,
            },
        ].forEach(({ selectedItems, expectedChosenItemCount }) => {
            test('should have the right chosen items', () => {
                const chosenItems = getChosenItemsFromSelectedItems(selectedItems);
                expect(chosenItems.length).toEqual(expectedChosenItemCount);
            });
        });
    });
});
