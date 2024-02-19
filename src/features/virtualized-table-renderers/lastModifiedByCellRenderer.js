// @flow

import { formatUser } from './FormattedUser';
import baseCellRenderer from './baseCellRenderer';
import messages from './messages';
import type { LastModifiedByCellRendererCellData, LastModifiedByCellRendererParams } from './flowTypes';
import timeFromNow from '../../utils/relativeTime';

type LastModifiedByCellRendererSettings = {
    dateFormat?: Object,
};

const lastModifiedByCellRenderer = (intl: any, { dateFormat }: LastModifiedByCellRendererSettings = {}) => (
    cellRendererParams: LastModifiedByCellRendererParams,
) =>
    baseCellRenderer(cellRendererParams, ({ modified_at, modified_by }: LastModifiedByCellRendererCellData) => {
        let lastModified = '';

        if (dateFormat) {
            lastModified = intl.formatDate(modified_at, dateFormat);
        } else {
            const { value, unit } = timeFromNow(Date.parse(modified_at));
            lastModified = intl.formatRelativeTime(value, unit);
        }

        if (modified_by) {
            const { id, name, email, login } = modified_by;
            const user = formatUser({ id, email: email || login, name }, intl);

            return intl.formatMessage(messages.lastModifiedBy, { lastModified, user });
        }
        return lastModified;
    });

export default lastModifiedByCellRenderer;
