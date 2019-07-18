import * as React from 'react';
import { shallow } from 'enzyme';

import CommentDeleteConfirmation from '../CommentDeleteConfirmation';
import { COMMENT_TYPE_DEFAULT, COMMENT_TYPE_TASK } from '../../../../../constants';

describe('elements/content-sidebar/ActivityFeed/comment/CommentDeleteConfirmation', () => {
    const getWrapper = props =>
        shallow(
            <CommentDeleteConfirmation
                isOpen
                onDeleteCancel={jest.fn()}
                onDeleteConfirm={jest.fn()}
                type={COMMENT_TYPE_DEFAULT}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should render component with COMMENT_TYPE_DEFAULT', () => {
            const wrapper = getWrapper({ type: COMMENT_TYPE_DEFAULT });
            expect(wrapper.find('.bcs-CommentDeleteConfirmation-prompt')).toMatchSnapshot();
        });

        test('should render component with COMMENT_TYPE_TASK', () => {
            const wrapper = getWrapper({ type: COMMENT_TYPE_TASK });
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
