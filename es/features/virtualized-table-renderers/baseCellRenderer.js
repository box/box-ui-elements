import { EMPTY_VALUE } from './constants';
const baseCellRenderer = ({
  cellData
}, renderValue = String) => {
  if (typeof cellData === 'undefined' || cellData === null || cellData === '') {
    return EMPTY_VALUE;
  }
  return renderValue(cellData);
};
export default baseCellRenderer;
//# sourceMappingURL=baseCellRenderer.js.map