/**
 * @flow
 * @file Base class for the Open With ES6 wrapper
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import OpenWithComponent from '../components/OpenWith/OpenWith';

class OpenWith extends ES6Wrapper {
    /** @inheritdoc */
    render() {
        render(
            <OpenWithComponent
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
global.Box.OpenWith = OpenWith;
export default OpenWith;
