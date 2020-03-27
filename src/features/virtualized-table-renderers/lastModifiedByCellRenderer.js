// @flow

import { formatUser } from './FormattedUser';
import baseCellRenderer from './baseCellRenderer';
import messages from './messages';
import type { LastModifiedByCellRendererCellData, LastModifiedByCellRendererParams } from './flowTypes';

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
        } else if (intl.formatRelativeTime) {
            // react-intl v3
            lastModified = intl.formatRelativeTime(Date.parse(modified_at) - Date.now(), 'day', {
                style: 'short',
                numeric: 'auto',
            });
        } else {
            // react-intl v2
            lastModified = intl.formatRelative(Date.parse(modified_at), { units: 'day-short', style: 'numeric' });
        }

        if (modified_by) {
            const { id, name, email, login } = modified_by;
            const user = formatUser({ id, email: email || login, name }, intl);

            return intl.formatMessage(messages.lastModifiedBy, { lastModified, user });
        }
        return lastModified;
    });

export default lastModifiedByCellRenderer;
