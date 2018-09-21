/**
 * @flow
 * @file Base class for the Open With ES6 wrapper
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentOpenWithReactComponent from '../components/ContentOpenWith/ContentOpenWith';

class ContentOpenWith extends ES6Wrapper {
    /** @inheritdoc */
    render() {
        render(
            <ContentOpenWithReactComponent
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
global.Box.ContentOpenWith = ContentOpenWith;
export default ContentOpenWith;
