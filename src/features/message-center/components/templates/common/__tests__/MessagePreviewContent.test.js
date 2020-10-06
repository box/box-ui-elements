import * as React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import MessagePreviewContent from '../MessagePreviewContent';

const defaultProps = {
    apiHost: 'https://api.box.com/',
    fileId: '89283839922',
    getToken: jest.fn(),
    sharedLink: 'https://cloud.box.com/s/asdf',
};

const getWrapper = props => mount(<MessagePreviewContent {...defaultProps} {...props} />);

describe('components/message-center/components/templates/common/MessagePreviewContent', () => {
    test('should hide ContentPreview behind Ghost component while loading content', () => {
        const wrapper = getWrapper();
        expect(
            wrapper
                .find('ForwardRef')
                .first()
                .hasClass('is-loading'),
        ).toBe(true);
        expect(wrapper.find('PreviewGhost').exists()).toBe(true);
    });

    test('should show PreviewErrorNotification window on error', () => {
        const wrapper = getWrapper({
            getToken: jest.fn().mockResolvedValue('token'),
        });
        const contentPreview = wrapper.find('ForwardRef').first();
        act(() => {
            contentPreview.props().onError();
        });
        wrapper.update();
        expect(wrapper.find('PreviewErrorNotification').exists()).toBe(true);
    });

    test.skip('should remove Ghost component when content is loaded', () => {
        jest.spyOn(React, 'useRef').mockImplementation(() => {
            return { current: { getViewer: () => ({ disableViewerControls: jest.fn() }) } };
        });
        const wrapper = getWrapper({
            getToken: jest.fn().mockResolvedValue('token'),
        });

        const contentPreview = wrapper.find('ForwardRef').first();
        act(() => {
            contentPreview.props().onLoad();
        });
        wrapper.update();
        expect(wrapper.find('PreviewGhost').exists()).toBe(false);
    });
});
