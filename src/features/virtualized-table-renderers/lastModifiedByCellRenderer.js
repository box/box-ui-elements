// @flow
import type { IntlShape } from 'react-intl';
import { formatUser } from './FormattedUser';
import baseCellRenderer from './baseCellRenderer';
import messages from './messages';
import type { LastModifiedByCellRendererCellData, LastModifiedByCellRendererParams } from './flowTypes';

type LastModifiedByCellRendererSettings = {
    dateFormat?: Object,
};

const lastModifiedByCellRenderer = (intl: IntlShape, { dateFormat }: LastModifiedByCellRendererSettings = {}) => (
    cellRendererParams: LastModifiedByCellRendererParams,
) =>
    baseCellRenderer(cellRendererParams, ({ modified_at, modified_by }: LastModifiedByCellRendererCellData) => {
        const lastModified = dateFormat
            ? intl.formatDate(modified_at, dateFormat)
            : intl.formatRelative(Date.parse(modified_at), { units: 'day-short', style: 'numeric' });

        if (modified_by) {
            const { id, name, email, login } = modified_by;
            const user = formatUser({ id, email: email || login, name }, intl);

            return intl.formatMessage(messages.lastModifiedBy, { lastModified, user });
        }
        return lastModified;
    });

export default lastModifiedByCellRenderer;
