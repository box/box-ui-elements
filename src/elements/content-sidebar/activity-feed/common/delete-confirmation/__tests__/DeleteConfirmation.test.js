import * as React from 'react';
import { mount } from 'enzyme';

import { DeleteConfirmationBase as DeleteConfirmation } from '../DeleteConfirmation';
import messages from '../../../comment/messages';

describe('elements/content-sidebar/ActivityFeed/common/delete-confirmation', () => {
    const getWrapper = props =>
        mount(
            <DeleteConfirmation
                isOpen
                message={messages.commentDeletePrompt}
                onDeleteCancel={jest.fn()}
                onDeleteConfirm={jest.fn()}
                intl={{ formatMessage: jest.fn() }}
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
            const overlay = wrapper.find('Overlay');
            overlay.prop('onKeyDown')({ key: 'Escape', preventDefault: jest.fn(), stopPropagation: jest.fn() });
            expect(onDeleteCancelMock).toBeCalled();
            expect(onDeleteConfirmMock).not.toBeCalled();
        });
    });
});
