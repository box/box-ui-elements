/**
 * @flow
 * @file Base class for the Content Sharing ES6 wrapper
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentSharingReactComponent from '../content-sharing';

class ContentSharing extends ES6Wrapper {
    /** @inheritdoc */
    render() {
        render(
            <ContentSharingReactComponent
                componentRef={this.setComponent}
                itemID={this.id}
                // itemType={this.itemType}
                language={this.language}
                token={this.token}
                {...this.options}
            />,
            this.container,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentSharing = ContentSharing;
export default ContentSharing;
