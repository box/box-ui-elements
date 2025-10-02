import { formatUser } from './FormattedUser';
import baseCellRenderer from './baseCellRenderer';
import messages from './messages';
import timeFromNow from '../../utils/relativeTime';
const lastModifiedByCellRenderer = (intl, {
  dateFormat
} = {}) => cellRendererParams => baseCellRenderer(cellRendererParams, ({
  modified_at,
  modified_by
}) => {
  let lastModified = '';
  if (dateFormat) {
    lastModified = intl.formatDate(modified_at, dateFormat);
  } else {
    const {
      value,
      unit
    } = timeFromNow(Date.parse(modified_at));
    lastModified = intl.formatRelativeTime(value, unit);
  }
  if (modified_by) {
    const {
      id,
      name,
      email,
      login
    } = modified_by;
    const user = formatUser({
      id,
      email: email || login,
      name
    }, intl);
    return intl.formatMessage(messages.lastModifiedBy, {
      lastModified,
      user
    });
  }
  return lastModified;
});
export default lastModifiedByCellRenderer;
//# sourceMappingURL=lastModifiedByCellRenderer.js.map