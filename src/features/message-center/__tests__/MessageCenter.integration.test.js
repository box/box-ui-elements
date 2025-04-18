// @flow
import React, { act } from 'react';
import { AutoSizer } from '@box/react-virtualized';

import { mountConnected } from '../../../test-utils/enzyme';
import MessageCenter from '../components/MessageCenter';
import PlainButton from '../../../components/plain-button';
import Message from '../components/message/Message';

const countResponse = { count: 3 };

const messageResponse = [
    {
        activateDate: 1598857200,
        id: 1,
        name: 'messagecenter_test_message1',
        priority: 50,
        templateName: 'preview-title-body-tags',
        templateParams: {
            fileUpload: { fileId: '21313', sharedLinkUrl: 'https://app.box.com/s/e32eddass' },
            title: 'Test message 1',
            body: 'This is a <em>test</em>',
            tags: 'lorem,ipsum',
            category: 'product',
            button1: {
                label: 'learn more',
                actions: [
                    { type: 'openURL', target: '_blank', url: 'https://support.box.com/hc/en-us' },
                    { type: 'close' },
                ],
            },
        },
    },
    {
        activateDate: 1599202800,
        id: 2,
        name: 'messagecenter_test_message2',
        priority: 30,
        templateName: 'preview-title-body-tags',
        templateParams: {
            fileUpload: { fileId: '21313', sharedLinkUrl: 'https://app.box.com/s/e32eddass' },
            title: 'Test message 2',
            body: 'lorem ipsum',
            tags: 'lorem,ipsum',
            category: 'product',
            button1: {
                label: 'check this out',
                actions: [{ type: 'openURL', target: '_blank', url: 'http://community.box.com' }, { type: 'close' }],
            },
        },
    },
    {
        activateDate: 1599202800,
        id: 3,
        name: 'messagecenter_test_message3',
        priority: 20,
        templateName: 'preview-title-body-tags',
        templateParams: {
            fileUpload: { fileId: '321321', sharedLinkUrl: 'https://app.box.com/s/e32eddass' },
            title: 'Test message 3',
            body: 'lorem',
            tags: 'ipsum',
            category: 'education',
            button1: {
                label: 'foo',
                actions: [{ type: 'openURL', target: '_blank', url: 'http://www.google.com' }, { type: 'close' }],
            },
        },
    },
];

// the following are workarounds from https://github.com/enzymejs/enzyme/issues/2073#issuecomment-531488981
// and are used to prevent warnings for surrounding with act
function wait(amount = 0) {
    return new Promise(resolve => setTimeout(resolve, amount));
}

// Use this in your test after mounting if you need just need to let the query finish without updating the wrapper
async function actWait(amount = 0) {
    await act(async () => {
        await wait(amount);
    });
}

function ButtonComponent({ render, ...rest }: { render: () => React.Node }) {
    return <PlainButton {...rest}>{render()}</PlainButton>;
}

describe('components/message-center/MessageCenter.integration', () => {
    async function getWrapper(props = {}) {
        const getEligibleMessages = jest.fn().mockResolvedValue(messageResponse);
        const getUnreadMessageCount = jest.fn().mockResolvedValue(countResponse);
        const postMarkAllMessagesAsSeen = jest.fn().mockResolvedValue(null);
        const defaultProps = {
            apiHost: 'https://www.box.com/api',
            buttonComponent: ButtonComponent,
            getEligibleMessages,
            getToken: jest.fn().mockResolvedValue('token123'),
            getUnreadMessageCount,
            postMarkAllMessagesAsSeen,
            overscanRowCount: 10,
        };
        const wrapper = mountConnected(<MessageCenter {...defaultProps} {...props} />);
        await actWait();
        return wrapper;
    }

    function openModal(wrapper) {
        act(() => {
            wrapper.find('Megaphone20').simulate('click');
        });
    }

    beforeEach(() => {
        jest.spyOn(AutoSizer.prototype, 'render').mockImplementation(function render() {
            return <div>{this.props.children({ width: 720, height: 1024 })}</div>;
        });
    });

    test('should render the icon with count', async () => {
        const wrapper = await getWrapper();

        expect(wrapper.find('ButtonComponent[data-testid="message-center-unread-count"]').text()).toBe(
            countResponse.count.toString(),
        );
    });

    test('should render ghost state while fetching messages', async () => {
        const getEligibleMessages = jest.fn().mockImplementation(() => new Promise(() => {}));
        const wrapper = await getWrapper({ getEligibleMessages });
        openModal(wrapper);
        wrapper.update();

        expect(wrapper.find('MessagePreviewGhost').exists()).toBe(true);
        expect(wrapper.find('ContentGhost').exists()).toBe(true);
    });

    test('should render all the messages by default', async () => {
        const wrapper = await getWrapper();
        openModal(wrapper);
        wrapper.update();

        expect(wrapper.find('Message')).toHaveLength(messageResponse.length);
    });

    test('should set the message count to 0 when modal is opened', async () => {
        const wrapper = await getWrapper();
        openModal(wrapper);
        wrapper.update();

        expect(wrapper.find('CountBadge').props().isVisible).toBe(false);
        expect(wrapper.find('CountBadge').props().value).toBe(0);
        expect(wrapper.prop('postMarkAllMessagesAsSeen')).toHaveBeenCalled();
    });

    test('should filter messages by product category', async () => {
        const wrapper = await getWrapper();
        openModal(wrapper);
        wrapper.update();

        act(() => {
            wrapper
                .find('CategorySelector')
                .find('.bdl-CategorySelector-pill')
                .findWhere(n => {
                    return n.text() === 'Product';
                })
                .at(0)
                .simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(Message)).toHaveLength(2);
    });

    test('should render ButtonComponent with badgeCount prop passed from MessageCenter', async () => {
        const wrapper = await getWrapper();
        const badgeCount = countResponse.count;

        await actWait();
        wrapper.update();

        expect(wrapper.find('ButtonComponent').props().badgeCount).toBe(badgeCount);
    });
});
