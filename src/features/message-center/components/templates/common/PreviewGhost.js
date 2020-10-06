// @flow
import * as React from 'react';
import Ghost from '../../../../../components/ghost/Ghost';

function PreviewGhost() {
    return (
        <div className="PreviewGhost">
            <Ghost className="PreviewGhost-ghost" height={288} />
        </div>
    );
}

export default PreviewGhost;
