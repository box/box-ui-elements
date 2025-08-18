import * as React from 'react';
import { useIntl } from 'react-intl';
import { XMark } from '@box/blueprint-web-assets/icons/Fill/index';
import { IconButton, PageHeader, Text } from '@box/blueprint-web';
import type { Selection } from 'react-aria-components';
import { useSelectedItemText } from '../../content-explorer/utils';
import type { Collection } from '../../../common/types/core';
import messages from '../messages';

import './SubHeaderLeftV2.scss';

export interface SubHeaderLeftV2Props {
    currentCollection: Collection;
    onClearSelectedItemIds?: () => void;
    rootName?: string;
    selectedItemIds: Selection;
    title?: string;
}

const SubHeaderLeftV2 = (props: SubHeaderLeftV2Props) => {
    const { currentCollection, onClearSelectedItemIds, rootName, selectedItemIds, title } = props;
    const { formatMessage } = useIntl();

    const selectedItemText = useSelectedItemText(currentCollection, selectedItemIds);

    // Case 1 and 2: selected item text with X button
    if (selectedItemText) {
        return (
            <PageHeader.Root className="be-SubHeaderLeftV2--selection" variant="default">
                <PageHeader.Corner>
                    <IconButton
                        aria-label={formatMessage(messages.clearSelection)}
                        icon={XMark}
                        onClick={onClearSelectedItemIds}
                        variant="small-utility"
                    />
                </PageHeader.Corner>

                <PageHeader.StartElements>
                    <Text as="span">{selectedItemText}</Text>
                </PageHeader.StartElements>
            </PageHeader.Root>
        );
    }

    // Case 3: No selected items - show title if provided, otherwise show root name
    return (
        <Text as="h1" variant="titleXLarge">
            {title ?? rootName}
        </Text>
    );
};

export default SubHeaderLeftV2;
