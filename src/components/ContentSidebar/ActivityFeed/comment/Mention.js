/**
 * @flow
 * @file Mention component
 */

import React from 'react';

type Props = {
    children: PropTypes.node.isRequired,
    id: PropTypes.number.isRequired
};

const Mention = ({ children, id, ...rest }: Props) => {
    delete rest.mentionTrigger;
    return (
        <a {...rest} style={{ display: 'inline-block' }} href={`/profile/${id}`}>
            {children}
        </a>
    );
};

Mention.displayName = 'Mention';

export default Mention;
