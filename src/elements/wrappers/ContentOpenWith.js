/**
 * @flow
 * @file Base class for the Open With ES6 wrapper
 * @author Box
 */

import 'regenerator-runtime/runtime';
import * as React from 'react';
import { versionAwareRender } from '../../utils/dom-render';
import ES6Wrapper from './ES6Wrapper';
import ContentOpenWithReactComponent from '../content-open-with';

class ContentOpenWith extends ES6Wrapper {
    /**
     * Callback for executing an integration
     *
     * @return {void}
     */
    onExecute = (appIntegrationId: string): void => {
        this.emit('execute', appIntegrationId);
    };

    /**
     * Callback when an error occurs while loading or executing integrations
     *
     * @return {void}
     */
    onError = (error: Error): void => {
        this.emit('error', error);
    };

    /** @inheritdoc */
    render() {
        this.cleanup = versionAwareRender(
            <ContentOpenWithReactComponent
                componentRef={this.setComponent}
                fileId={this.id}
                language={this.language}
                messages={this.messages}
                onError={this.onError}
                onExecute={this.onExecute}
                onInteraction={this.onInteraction}
                token={this.token}
                {...this.options}
            />,
            this.container,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentOpenWith = ContentOpenWith;
export default ContentOpenWith;
