/**
 * @flow
 * @file Base class for the content preview ES6 wrapper, only used for testing
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import { ContentPreview as ContentPreviewResponsive } from '../components/ContentPreview/ContentPreview';

class ContentPreview extends ES6Wrapper {
    /** @inheritdoc */
    render() {
        render(
            <ContentPreviewResponsive
                language={this.language}
                messages={this.messages}
                fileId={this.id}
                token={this.token}
                componentRef={this.setComponent}
                onInteraction={this.onInteraction}
                {...this.options}
            />,
            this.container
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentPreview = ContentPreview;
export default ContentPreview;
