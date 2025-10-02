import * as React from 'react';
import Ghost from '../../components/ghost';
import './GraphGhostState.scss';
const GRAPH_BAR_HEIGHTS = [28, 36, 54, 80, 36, 48, 28];
const GraphGhostState = () => /*#__PURE__*/React.createElement("div", {
  className: "GraphGhostState"
}, GRAPH_BAR_HEIGHTS.map((height, index) =>
/*#__PURE__*/
// eslint-disable-next-line react/no-array-index-key
React.createElement(Ghost, {
  key: index,
  borderRadius: 4,
  height: height
})));
export default GraphGhostState;
//# sourceMappingURL=GraphGhostState.js.map