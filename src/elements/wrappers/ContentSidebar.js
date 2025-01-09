/**
 * @flow
 * @file Base class for the Content Sidebar ES6 wrapper
 * @author Box
 */

import * as React from 'react';
import { versionAwareRender } from '../../utils/dom-render';
import ES6Wrapper from './ES6Wrapper';
import ContentSidebarComponent from '../content-sidebar';

class ContentSidebar extends ES6Wrapper {
    /**
     * Helper to programmatically refresh the current sidebar panel
     * @returns {void}
     */
    refresh(): void {
        this.getComponent().refresh();
    }

    /** @inheritdoc */
    render() {
        this.cleanup = versionAwareRender(
            <ContentSidebarComponent
                componentRef={this.setComponent}
                fileId={this.id}
                language={this.language}
                messages={this.messages}
                onInteraction={this.onInteraction}
                token={this.token}
                {...this.options}
            />,
            this.container,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentSidebar = ContentSidebar;
export default ContentSidebar;
