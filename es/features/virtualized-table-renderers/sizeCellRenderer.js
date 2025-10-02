import baseCellRenderer from './baseCellRenderer';
import getSize from '../../utils/size';
import { DEFAULT_MULTIPLIER } from './constants';
const sizeCellRenderer = (multiplier = DEFAULT_MULTIPLIER) => cellRendererParams => baseCellRenderer(cellRendererParams, cellValue => getSize(Number(cellValue) * multiplier));
export default sizeCellRenderer;
//# sourceMappingURL=sizeCellRenderer.js.map