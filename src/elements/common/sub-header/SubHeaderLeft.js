/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import messages from '../messages';
import { Breadcrumbs } from '../breadcrumbs';
import { VIEW_SEARCH, VIEW_FOLDER, VIEW_RECENTS, DELIMITER_CARET } from '../../../constants';
import type { View, Collection } from '../../../common/types/core';

type Props = {
    currentCollection: Collection,
    isSmall: boolean,
    onItemClick: Function,
    rootId: string,
    rootName?: string,
    view: View,
} & InjectIntlProvidedProps;

const SubHeaderLeft = ({ view, isSmall, rootId, rootName, currentCollection, onItemClick, intl }: Props) => {
    let crumbs;

    if (view === VIEW_FOLDER || view === VIEW_SEARCH) {
        const { id, name = '', breadcrumbs = [] } = currentCollection;
        crumbs = breadcrumbs.concat({ id, name });

        // Search results are specific to the current folder
        // hence the breadcrumb is added to the end of the list
        if (view === VIEW_SEARCH) {
            crumbs = crumbs.concat({
                id: undefined,
                name: intl.formatMessage(messages.searchBreadcrumb),
            });
        }
    } else {
        crumbs = [
            {
                id: undefined,
                name: intl.formatMessage(messages[`${view}Breadcrumb`]),
            },
        ];

        if (view !== VIEW_RECENTS) {
            crumbs.unshift({
                id: rootId,
                name: rootName || intl.formatMessage(messages.rootBreadcrumb),
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

export default injectIntl(SubHeaderLeft);
