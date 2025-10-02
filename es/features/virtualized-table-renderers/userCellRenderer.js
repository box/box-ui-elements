import baseCellRenderer from './baseCellRenderer';
import { formatUser } from './FormattedUser';
const userCellRenderer = intl => cellRendererParams => baseCellRenderer(cellRendererParams, ({
  id,
  email,
  name,
  login
}) => formatUser({
  id,
  email: email || login,
  name
}, intl));
export default userCellRenderer;
//# sourceMappingURL=userCellRenderer.js.map