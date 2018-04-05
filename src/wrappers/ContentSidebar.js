/**
 * @flow
 * @file Base class for the content preview ES6 wrapper, only used for testing
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentSidebarComponent from '../components/ContentSidebar/ContentSidebar';

class ContentSidebar extends ES6Wrapper {
    /** @inheritdoc */
    render() {
        render(
            <ContentSidebarComponent
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
global.Box.ContentSidebar = ContentSidebar;
export default ContentSidebar;
