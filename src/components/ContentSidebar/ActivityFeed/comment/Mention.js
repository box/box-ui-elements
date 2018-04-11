/**
 * @flow
 * @file Mention component
 */

import React from 'react';
import type { Node } from 'react';

type Props = {
    children?: Node,
    id: number,
    mentionTrigger?: any
};

const Mention = ({ children, id, ...rest }: Props): Node => {
    delete rest.mentionTrigger;
    return (
        <a {...rest} style={{ display: 'inline-block' }} href={`/profile/${id}`}>
            {children}
        </a>
    );
};

Mention.displayName = 'Mention';

export default Mention;
