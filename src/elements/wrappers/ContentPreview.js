/**
 * @flow
 * @file Base class for the Content Preview ES6 wrapper
 * @author Box
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ES6Wrapper from './ES6Wrapper';
import ContentPreviewResponsive from '../content-preview';

class ContentPreview extends ES6Wrapper {
    /**
     * Helper to programmatically refresh the preview's sidebar panel
     * @returns {void}
     */
    refreshSidebar(): void {
        this.getComponent().refreshSidebar();
    }

    /** @inheritdoc */
    render() {
        this.root = createRoot(this.container);
        this.root.render(
            <ContentPreviewResponsive
                componentRef={this.setComponent}
                fileId={this.id}
                language={this.language}
                messages={this.messages}
                onInteraction={this.onInteraction}
                token={this.token}
                {...this.options}
            />,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentPreview = ContentPreview;
export default ContentPreview;
