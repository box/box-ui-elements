import React from 'react';
import { shallow } from 'enzyme';
import { ContentPreviewComponent as ContentPreview } from '../ContentPreview';

jest.mock('../../Internationalize', () => 'mock-internationalize');

describe('components/ContentPreview/ContentPreview', () => {
    const getWrapper = (props) => shallow(<ContentPreview {...props} />);

    beforeEach(() => {
        // Fresh global preview object
        global.Box = {};
        global.Box.Preview = function Preview() {
            this.addListener = jest.fn();
            this.updateFileCache = jest.fn();
            this.show = jest.fn();
        };
    });

    it('should bind onError function property to preview "preview_error" event', () => {
        const props = {
            onError: jest.fn(),
            fileId: '12345634567',
            token: 'asdf'
        };

        const wrapper = getWrapper(props);
        wrapper.setState({ ...wrapper.instance().state, file: { a: '' } }, () => {
            wrapper.setProps(props);
            expect(wrapper.instance().preview.addListener).toHaveBeenCalledWith('preview_error', props.onError);
        });
    });

    it('should bind onMetric function property to preview "preview_metric" event', () => {
        const props = {
            onMetric: jest.fn(),
            fileId: '12345634567',
            token: 'asdf'
        };

        const wrapper = getWrapper(props);
        wrapper.setState({ ...wrapper.instance().state, file: { a: '' } }, () => {
            wrapper.setProps(props);
            expect(wrapper.instance().preview.addListener).toHaveBeenCalledWith('preview_metric', props.onMetric);
        });
    });
});
