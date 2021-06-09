// @flow
import * as React from 'react';
import Ghost from '../../components/ghost/Ghost';

function MessagePreviewGhost() {
    return (
        <div className="MessagePreviewGhost">
            <Ghost className="MessagePreviewGhost-ghost" height={288} />
        </div>
    );
}

export default MessagePreviewGhost;
