// @flow
import * as React from 'react';

import { IntlProvider } from 'react-intl';
import { BaseCommentMenu, type BaseCommentMenuProps } from '../BaseCommentMenu';
import { baseCommmentMenuDefaultProps } from './common';

const getTemplate = customProps => (props: BaseCommentMenuProps) => (
    <div style={{ marginLeft: '12rem', marginTop: '10.5rem' }}>
        <IntlProvider locale="en">
            <BaseCommentMenu {...baseCommmentMenuDefaultProps} {...customProps} {...props} />
        </IntlProvider>
    </div>
);

export const AllPermissions = getTemplate();
export const CannotDelete = getTemplate({ canDelete: false });
export const CannotResolve = getTemplate({ canResolve: false });
export const CannotModify = getTemplate({ canEdit: false });
export const ConfirmingDelete = getTemplate({ isConfirmingDelete: true });

export default {
    title: 'Components/BaseCommentMenu',
    component: BaseCommentMenu,
    parameters: { layout: 'centered' },
};
