import PropTypes from 'prop-types';
import React from 'react';

const Mention = ({ children, id, ...rest }) => {
    delete rest.mentionTrigger;
    return (
        <a {...rest} style={{ display: 'inline-block' }} href={`/profile/${id}`}>
            {children}
        </a>
    );
};

Mention.displayName = 'Mention';

Mention.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.number.isRequired
};

export default Mention;
