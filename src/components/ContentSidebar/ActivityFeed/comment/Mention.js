/**
 * @flow
 * @file Mention component
 */

import * as React from 'react';

type Props = {
    children?: React.Node,
    id: number,
    mentionTrigger?: any
};

const Mention = ({ children, id, ...rest }: Props): React.Node => {
    delete rest.mentionTrigger;
    return (
        <a {...rest} style={{ display: 'inline-block' }} href={`/profile/${id}`}>
            {children}
        </a>
    );
};

Mention.displayName = 'Mention';

export default Mention;
