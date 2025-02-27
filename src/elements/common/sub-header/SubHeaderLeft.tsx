/**
 * @file Content sub header component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Breadcrumbs } from '../breadcrumbs';
import { View, Collection } from '../../../common/types/core';
import { VIEW_FOLDER } from '../../../constants';

import messages from '../messages';

interface Props {
    currentCollection: Collection;
    isSmall: boolean;
    onItemClick: (id: string) => void;
    rootId: string;
    rootName?: string;
    view: View;
}

const SubHeaderLeft = ({ view, isSmall, rootId, rootName, currentCollection, onItemClick }: Props) => {
    let crumbs;
    let title;

    if (view === VIEW_FOLDER) {
        const { breadcrumbs = [], name } = currentCollection;
        title = name;

        if (breadcrumbs.length > 0) {
            crumbs = breadcrumbs.map(({ id = '', name: crumbName }) => ({
                name: crumbName,
                onClick: () => onItemClick(id),
            }));
        } else if (rootId && rootName) {
            crumbs = [
                {
                    name: rootName,
                    onClick: () => onItemClick(rootId),
                },
            ];
        }
    } else {
        title = <FormattedMessage {...messages[view]} />;
    }

    return (
        <div className={classNames('be-sub-header-left', { 'be-sub-header-left--small': isSmall })}>
            {crumbs ? <Breadcrumbs crumbs={crumbs} /> : <span className="be-sub-header-title">{title}</span>}
        </div>
    );
};

export default SubHeaderLeft;
