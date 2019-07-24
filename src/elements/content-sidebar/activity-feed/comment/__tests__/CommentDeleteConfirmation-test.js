import * as React from 'react';
import { shallow } from 'enzyme';

import CommentDeleteConfirmation from '../CommentDeleteConfirmation';
import messages from '../messages';

describe('elements/content-sidebar/ActivityFeed/comment/CommentDeleteConfirmation', () => {
    const getWrapper = props =>
        shallow(
            <CommentDeleteConfirmation
                isOpen
                message={messages.commentDeletePrompt}
                onDeleteCancel={jest.fn()}
                onDeleteConfirm={jest.fn()}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render component', () => {
            const wrapper = getWrapper();
            expect(wrapper.find('.bcs-CommentDeleteConfirmation-prompt')).toMatchSnapshot();
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
