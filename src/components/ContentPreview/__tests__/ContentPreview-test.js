import React from 'react';
import { shallow } from 'enzyme';
import ContentPreview from '../ContentPreview';

describe('components/ContentPreview/ContentPreview', () => {
    const getWrapper = (props) => shallow(<ContentPreview {...props} />);

    beforeEach(() => {
        // Fresh global preview object
        global.Preview = function() {};
    });

    it('should bind onError function property to preview "preview_error" event', () => {
        const props = {
            onError: jest.fn()
        };
    });

    it('', () => {
        const props = {
            onMetric: jest.fn()
        };
    });
});
