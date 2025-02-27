/**
 * @file Content sub header component
 * @author Box
 */

import * as React from 'react';
import { useIntl } from 'react-intl';
import { Breadcrumbs } from '../breadcrumbs';
import { View, Collection } from '../../../common/types/core';
import { VIEW_SEARCH, VIEW_FOLDER, VIEW_RECENTS, DELIMITER_CARET } from '../../../constants';

import messages from '../messages';

interface SubHeaderLeftProps {
    currentCollection: Collection;
    isSmall: boolean;
    onItemClick: (id: string) => void;
    rootId: string;
    rootName?: string;
    view: View;
}

const SubHeaderLeft = ({ view, isSmall, rootId, rootName, currentCollection, onItemClick }: SubHeaderLeftProps) => {
    let crumbs;
    const { formatMessage } = useIntl();

    if (view === VIEW_FOLDER || view === VIEW_SEARCH) {
        const { id, name = '', breadcrumbs = [] } = currentCollection;
        crumbs = breadcrumbs.concat({ id, name });

        // Search results are specific to the current folder
        // hence the breadcrumb is added to the end of the list
        if (view === VIEW_SEARCH) {
            crumbs = crumbs.concat({
                id: undefined,
                name: formatMessage(messages.searchBreadcrumb),
            });
        }
    } else {
        crumbs = [
            {
                id: undefined,
                name: formatMessage(messages[`${view}Breadcrumb`]),
            },
        ];

        if (view !== VIEW_RECENTS) {
            crumbs.unshift({
                id: rootId,
                name: rootName || formatMessage(messages.rootBreadcrumb),
            });
        }
    }

    return (
        <Breadcrumbs
            crumbs={crumbs}
            delimiter={DELIMITER_CARET}
            isSmall={isSmall}
            onCrumbClick={onItemClick}
            rootId={rootId}
        />
    );
};

export default SubHeaderLeft;
