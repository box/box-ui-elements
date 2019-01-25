// @flow
// apars: This type is in a separate file in order to avoid circular dependency
import * as React from 'react';

export type Callout = {
    content: React.Element<any>,
    onClose?: Function,
};
