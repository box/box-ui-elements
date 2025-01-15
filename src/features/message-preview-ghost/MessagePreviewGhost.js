// @flow
import * as React from 'react';
import Ghost from '../../components/ghost/Ghost';

function MessagePreviewGhost(props) {
    return (
        <div className="MessagePreviewGhost" {...props}>
            <Ghost className="MessagePreviewGhost-ghost" height={288} />
        </div>
    );
}

export default MessagePreviewGhost;
