// @flow
import * as React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import FormattedUser from './FormattedUser';
import baseCellRenderer from './baseCellRenderer';
import messages from './messages';
import type { LastModifiedByCellRendererCellData, LastModifiedByCellRendererParams } from './flowTypes';

type LastModifiedByCellRendererSettings = {
    dateFormat?: Object,
};

const lastModifiedByCellRenderer = ({ dateFormat }: LastModifiedByCellRendererSettings = {}) => (
    cellRendererParams: LastModifiedByCellRendererParams,
) =>
    baseCellRenderer(cellRendererParams, ({ modifiedAt, modifiedBy }: LastModifiedByCellRendererCellData) => {
        const lastModified = dateFormat ? (
            <FormattedDate value={modifiedAt} format={dateFormat} />
        ) : (
            // eslint-disable-next-line react/style-prop-object
            <FormattedRelative value={Date.parse(modifiedAt)} units="day-short" style="numeric" />
        );

        if (modifiedBy) {
            const { id, name, email, login } = modifiedBy;
            const user = <FormattedUser id={id} email={email || login} name={name} />;

            return <FormattedMessage {...messages.lastModifiedBy} values={{ lastModified, user }} />;
        }
        return lastModified;
    });

export default lastModifiedByCellRenderer;
