import React from 'react';
import Ghost from '../../components/ghost';

import './GraphGhostState.scss';

const GRAPH_BAR_HEIGHTS = [28, 36, 54, 80, 36, 48, 28];

const GraphGhostState = () => (
    <div className="GraphGhostState">
        {GRAPH_BAR_HEIGHTS.map((height, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Ghost key={index} borderRadius={4} height={height} />
        ))}
    </div>
);

export default GraphGhostState;
