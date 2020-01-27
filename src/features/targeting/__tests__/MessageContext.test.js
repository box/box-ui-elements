// @flow
import * as React from 'react';
import { act } from 'react-dom/test-utils';

import { MessageContextProvider, useMessage, type MessageApi } from '..';

const TargetedComponent = () => {
    const { canShow, onClose, onShow } = useMessage('msg');
    if (canShow()) {
        onShow();
        return <button onClick={onClose} type="button" />;
    }
    return null;
};

const ComponentForTest = ({ messageApi }: { messageApi: MessageApi }) => {
    return (
        <MessageContextProvider messageApi={messageApi}>
            <TargetedComponent />
        </MessageContextProvider>
    );
};

describe('features/targeting/MessageContext', () => {
    const markMessageAsClosed = jest.fn();
    const markMessageAsSeen = jest.fn();

    const getWrapper = (eligibleMessageIDMap = {}) => {
        const messageApi = { eligibleMessageIDMap, markMessageAsClosed, markMessageAsSeen };

        return mount(<ComponentForTest messageApi={messageApi} />);
    };

    test('should not render button when not eligible', () => {
        const wrapper = getWrapper();
        expect(wrapper.find('button').length).toBe(0);
        expect(markMessageAsSeen).toHaveBeenCalledTimes(0);
        expect(markMessageAsClosed).toHaveBeenCalledTimes(0);
    });

    test('should render button when eligible and call callbacks', () => {
        const wrapper = getWrapper({ msg: 3 });
        expect(wrapper.find('button').length).toBe(1);
        expect(markMessageAsSeen).toBeCalledWith(3);
        expect(markMessageAsClosed).not.toBeCalled();
        act(() => {
            wrapper
                .find('button')
                .at(0)
                .props()
                .onClick();
        });
        expect(markMessageAsClosed).toBeCalledWith(3);
        expect(markMessageAsSeen).toHaveBeenCalledTimes(1);
        expect(markMessageAsClosed).toHaveBeenCalledTimes(1);
    });
});
