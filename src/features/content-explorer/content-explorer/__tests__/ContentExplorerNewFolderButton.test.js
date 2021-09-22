import React from 'react';
import sinon from 'sinon';

import ContentExplorerModes from '../../modes';
import { ContentExplorerNewFolderButtonBase as ContentExplorerNewFolderButton } from '../ContentExplorerNewFolderButton';

describe('features/content-explorer/content-explorer/ContentExplorerNewFolderButton', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props =>
        shallow(<ContentExplorerNewFolderButton intl={{ formatMessage: () => 'message' }} {...props} />);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test.each([
            ContentExplorerModes.COPY,
            ContentExplorerModes.MOVE_COPY,
            ContentExplorerModes.MULTI_SELECT,
            ContentExplorerModes.SELECT_FOLDER,
        ])('should render the default component when mode is %s', contentExplorerMode => {
            const wrapper = renderComponent({
                contentExplorerMode,
            });

            expect(wrapper.hasClass('content-explorer-new-folder-button')).toBe(true);
            expect(wrapper.prop('isDisabled')).toBe(false);
            expect(wrapper.prop('title')).toEqual('');
        });

        test('should render nothing when contentExplorerMode does not allow creating folders', () => {
            const wrapper = renderComponent({
                contentExplorerMode: 'selectFile',
            });

            expect(wrapper.isEmptyRender()).toBe(true);
        });

        test('should render the button disabled when isDisabled is true', () => {
            const wrapper = renderComponent({
                contentExplorerMode: 'moveCopy',
                isDisabled: true,
            });

            expect(wrapper.prop('isDisabled')).toBe(true);
        });

        test('should render with a tooltip when isCreateNewFolderAllowed is false', () => {
            const wrapper = renderComponent({
                contentExplorerMode: 'moveCopy',
                isCreateNewFolderAllowed: false,
            });

            expect(wrapper.prop('title')).toBeTruthy();
        });
    });

    describe('onClick', () => {
        test('should call onClick when clicked', () => {
            const onClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                contentExplorerMode: 'moveCopy',
                onClick: onClickSpy,
            });

            wrapper.simulate('click');

            expect(onClickSpy.calledOnce).toBe(true);
        });
    });
});
