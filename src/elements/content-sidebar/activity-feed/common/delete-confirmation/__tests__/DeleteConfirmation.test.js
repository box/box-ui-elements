import * as React from 'react';
import { shallow } from 'enzyme';

import DeleteConfirmation from '../DeleteConfirmation';
import messages from '../../../comment/messages';

describe('elements/content-sidebar/ActivityFeed/common/delete-confirmation', () => {
    const getWrapper = props =>
        shallow(
            <DeleteConfirmation
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
