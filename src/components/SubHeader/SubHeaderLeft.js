/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { VIEW_SEARCH, VIEW_FOLDER, DELIMITER_CARET } from '../../constants';
import type { View, Collection } from '../../flowTypes';

type Props = {
    rootId: string,
    rootName?: string,
    onItemClick: Function,
    getLocalizedMessage: Function,
    currentCollection: Collection,
    view: View,
    isSmall: boolean
};

const SubHeaderLeft = ({
    view,
    isSmall,
    rootId,
    rootName,
    currentCollection,
    onItemClick,
    getLocalizedMessage
}: Props) => {
    let crumbs;

    if (view === VIEW_FOLDER || view === VIEW_SEARCH) {
        const { id, name = '', breadcrumbs = [] } = currentCollection;
        crumbs = breadcrumbs.concat({ id, name });

        // Search results are specific to the current folder
        // hence the breadcrumb is added to the end of the list
        if (view === VIEW_SEARCH) {
            crumbs = crumbs.concat({
                id: undefined,
                name: getLocalizedMessage('buik.folder.name.search')
            });
        }
    } else {
        crumbs = [
            {
                id: rootId,
                name: rootName || getLocalizedMessage('buik.folder.name.root')
            },
            {
                id: undefined,
                name: getLocalizedMessage(`buik.folder.name.${view}`)
            }
        ];
    }

    return (
        <Breadcrumbs
            isSmall={isSmall}
            rootId={rootId}
            crumbs={crumbs}
            onCrumbClick={onItemClick}
            delimiter={DELIMITER_CARET}
        />
    );
};

export default SubHeaderLeft;
