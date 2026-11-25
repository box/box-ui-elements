import * as React from 'react';
import { shallow } from 'enzyme';

import DeleteConfirmation from '../DeleteConfirmation';

const commentDeletePrompt = {
    id: 'be.contentSidebar.activityFeed.comment.commentDeletePrompt',
    description: 'Confirmation prompt text to delete comment',
    defaultMessage: 'Are you sure you want to permanently delete this comment?',
};

describe('elements/content-sidebar/ActivityFeed/common/delete-confirmation', () => {
    const getWrapper = props =>
        shallow(
            <DeleteConfirmation
                isOpen
                message={commentDeletePrompt}
                onDeleteCancel={jest.fn()}
                onDeleteConfirm={jest.fn()}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render component', () => {
            const wrapper = getWrapper();
            expect(wrapper.find('.bcs-DeleteConfirmation-promptMessage')).toMatchSnapshot();
        });
    });

    describe('onKeyDown', () => {
        test('should handle Escape key', () => {
            const onDeleteCancelMock = jest.fn();
            const onDeleteConfirmMock = jest.fn();
            const wrapper = getWrapper({ onDeleteCancel: onDeleteCancelMock, onDeleteConfirm: onDeleteConfirmMock });
            wrapper.simulate('keydown', {
                key: 'Escape',
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
                nativeEvent: { stopImmediatePropagation: jest.fn() },
            });
            expect(onDeleteCancelMock).toBeCalled();
            expect(onDeleteConfirmMock).not.toBeCalled();
        });
    });
});
