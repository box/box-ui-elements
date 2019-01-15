/**
 * @flow
 * @file Base class for the Content Preview ES6 wrapper
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentPreviewResponsive from '../content-preview';

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
            this.container,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentPreview = ContentPreview;
export default ContentPreview;
