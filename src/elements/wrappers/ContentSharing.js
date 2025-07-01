/**
 * @flow
 * @file Base class for the Content Sharing ES6 wrapper
 * @author Box
 */

import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentSharingReactComponent from '../content-sharing';
import { ITEM_TYPE_FILE } from '../../common/constants';
import type { ItemType } from '../../common/types/core';

class ContentSharing extends ES6Wrapper {
    /** @inheritdoc */
    render() {
        const { itemType }: { itemType?: ItemType } = this.options;

        render(
            <ContentSharingReactComponent
                itemID={this.id}
                itemType={itemType || ITEM_TYPE_FILE}
                language={this.language}
                messages={this.messages}
                token={this.token}
                uuid={uniqueId('contentSharing_')}
                {...this.options}
            />,
            this.container,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentSharing = ContentSharing;
export default ContentSharing;
