import React from 'react';

import SecurityControlsModal from '../SecurityControlsModal';
import SecurityControlsItem from '../SecurityControlsItem';

describe('features/classification/security-controls/SecurityControlsModal', () => {
    let wrapper;
    let modalItems;
    let appNames;

    const getWrapper = props =>
        shallow(
            <SecurityControlsModal
                appNames={null}
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
            { id: 'msg1', defaultMessage: 'message1' },
            { id: 'msg2', defaultMessage: 'message2' },
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
            { id: 'msg1', defaultMessage: 'message1' },
            { id: 'msg2', defaultMessage: 'message2' },
            { id: 'msg3', defaultMessage: 'message3' },
        ];
        wrapper = getWrapper({ modalItems, itemName: 'welcome.pdf' });

        expect(wrapper.find(SecurityControlsItem)).toHaveLength(3);
    });

    test('should pass appNames to SecurityControlsItem', () => {
        appNames = '123';

        wrapper.setProps({ appNames });
        expect(
            wrapper
                .find(SecurityControlsItem)
                .findWhere(item => item.props().message.id === 'msg1')
                .props().appNames,
        ).toEqual('123');
    });
});
