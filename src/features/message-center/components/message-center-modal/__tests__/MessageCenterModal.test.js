// @flow
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { AutoSizer } from 'react-virtualized';

import { mountConnected } from '../../../../../test-utils/enzyme';

import MessageCenterModal from '../MessageCenterModal';
import Message from '../../message/Message';
import CollapsibleScrollbar from '../../collapsibile-scrollbar/CollapsibleScrollbar';

jest.mock('lodash/debounce');
jest.mock('lodash/throttle');
jest.mock('../../message/Message', () => () => 'message');

describe('components/message-center/components/message-center-modal/MessageCenterModal', () => {
    beforeEach(() => {
        debounce.mockImplementation(fn => fn);
        throttle.mockImplementation(fn => fn);
        jest.spyOn(AutoSizer.prototype, 'render').mockImplementation(function render() {
            return <div>{this.props.children({ width: 720, height: 1024 })}</div>;
        });
    });

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
                    actions: [
                        { type: 'openURL', target: '_blank', url: 'http://community.box.com' },
                        { type: 'close' },
                    ],
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

    const defaultProps = {
        messages: messageResponse,
    };

    function getWrapper(props) {
        return mountConnected(<MessageCenterModal {...defaultProps} {...props} />);
    }

    test('should collapse filters when scrolled down and mouse is not in title', async () => {
        const wrapper = await getWrapper();
        act(() => {
            wrapper.find('[data-testid="modal-title"]').prop('onMouseEnter')();
        });
        wrapper.update();
        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-collapsed')).toBe(false);
        act(() => {
            wrapper.find('[data-testid="modal-title"]').prop('onMouseLeave')();
            wrapper.find(CollapsibleScrollbar).prop('onScroll')(
                { scrollHeight: 100, clientHeight: 200, scrollTop: 10 },
                { scrollHeight: 100, clientHeight: 200, scrollTop: 0 },
            );
        });
        wrapper.update();

        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-collapsed')).toBe(true);
    });

    test('should expand filters when scrolled up', async () => {
        const wrapper = await getWrapper();
        act(() => {
            wrapper.find('[data-testid="modal-title"]').prop('onMouseLeave')();
            wrapper.find(CollapsibleScrollbar).prop('onScroll')(
                { scrollHeight: 100, clientHeight: 200, scrollTop: 10 },
                { scrollHeight: 100, clientHeight: 200, scrollTop: 0 },
            );
        });
        wrapper.update();
        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-expanded')).toBe(false);

        act(() => {
            wrapper.find(CollapsibleScrollbar).prop('onScroll')(
                { scrollHeight: 100, clientHeight: 200, scrollTop: 0 },
                { scrollHeight: 100, clientHeight: 200, scrollTop: 10 },
            );
        });
        wrapper.update();

        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-expanded')).toBe(true);
    });

    test('should expand filters when mouse moves into title', async () => {
        const wrapper = await getWrapper();
        act(() => {
            wrapper.find('[data-testid="modal-title"]').prop('onMouseLeave')();
            wrapper.find(CollapsibleScrollbar).prop('onScroll')(
                { scrollHeight: 100, clientHeight: 200, scrollTop: 10 },
                { scrollHeight: 100, clientHeight: 200, scrollTop: 0 },
            );
        });
        wrapper.update();
        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-expanded')).toBe(false);

        act(() => {
            wrapper.find('[data-testid="modal-title"]').prop('onMouseEnter')();
        });
        wrapper.update();

        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-expanded')).toBe(true);
    });

    test('should not expand/collapse when client height changes', async () => {
        const wrapper = await getWrapper();
        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-expanded')).toBe(true);
        act(() => {
            wrapper.find(CollapsibleScrollbar).prop('onScroll')(
                { scrollHeight: 100, clientHeight: 200, scrollTop: 10 },
                { scrollHeight: 100, clientHeight: 300, scrollTop: 0 },
            );
        });
        wrapper.update();
        expect(wrapper.find('[data-testid="modal-title"]').hasClass('is-expanded')).toBe(true);
    });

    test('should render ErrorState when messages is an error', async () => {
        const wrapper = await getWrapper({ messages: new Error('network error') });

        expect(wrapper.find('ErrorState').exists()).toBe(true);
    });

    test('should display in correct order', async () => {
        const wrapper = await getWrapper();
        expect(wrapper.find(Message)).toHaveLength(3);
        expect(
            wrapper
                .find(Message)
                .at(0)
                .prop('id'),
        ).toBe(2);
        expect(
            wrapper
                .find(Message)
                .at(1)
                .prop('id'),
        ).toBe(3);
        expect(
            wrapper
                .find(Message)
                .at(2)
                .prop('id'),
        ).toBe(1);
    });
});
