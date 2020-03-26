import React from 'react';

import SecurityControlsModal from '../SecurityControlsModal';
import SecurityControlsItem from '../SecurityControlsItem';

describe('features/classification/security-controls/SecurityControlsModal', () => {
    let wrapper;
    let modalItems;

    const getWrapper = props =>
        shallow(
            <SecurityControlsModal
                closeModal={jest.fn()}
                definition="classification definition"
                classificationName="internal"
                isSecurityControlsModalOpen={false}
                itemName="welcome.pdf"
                modalItems={modalItems}
                {...props}
            />,
        );

    beforeEach(() => {
        modalItems = [
            { message: { id: 'msg1', defaultMessage: 'message1' } },
            { message: { id: 'msg2', defaultMessage: 'message2' } },
        ];
        wrapper = getWrapper();
    });

    test('should return null if itemName is not provided', () => {
        wrapper = getWrapper({ itemName: undefined });

        expect(wrapper.type()).toBeNull();
    });

    test('should render a SecurityControlsModal when itemName, classificationName, and definition are provided', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should render with correct number of security controls items', () => {
        modalItems = [
            { message: { id: 'msg1', defaultMessage: 'message1' } },
            { message: { id: 'msg2', defaultMessage: 'message2' } },
            { message: { id: 'msg3', defaultMessage: 'message3' } },
        ];
        wrapper = getWrapper({ modalItems, itemName: 'welcome.pdf' });

        expect(wrapper.find(SecurityControlsItem)).toHaveLength(3);
    });

    test('should pass tooltipMessage to SecurityControlsItem', () => {
        const tooltipMessage = { tooltipMessage: { id: 'msg3', defaultMessage: 'message3' } };
        modalItems = [
            { message: { id: 'msg1', defaultMessage: 'message1' } },
            {
                message: { id: 'msg2', defaultMessage: 'message2' },
                tooltipMessage,
            },
        ];
        wrapper.setProps({ modalItems });
        expect(
            wrapper
                .find(SecurityControlsItem)
                .findWhere(item => item.props().message.id === 'msg2')
                .props().tooltipMessage,
        ).toEqual(tooltipMessage);
    });
});
