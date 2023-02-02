// @flow
import * as React from 'react';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { RecordOf } from 'immutable';

import type { ItemType } from '../../common/types/core';
import { convertToMs, isToday, isYesterday } from '../../utils/datetime';
import DatalistItem from '../../components/datalist-item';
import Folder16 from '../../icon/fill/Folder16';
import ItemIcon from '../../icons/item-icon';
import { Link } from '../../components/link';

import { TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK } from '../../constants';
import messages from './messages';

import './QuickSearchItem.scss';

const QUERY_SEPARATOR = '<mark>';

type QuickSearchItemData = {
    extension?: string,
    iconType: string,
    id: string,
    name: string,
    nameWithMarkedQuery: string,
    parentName?: string,
    sharedLink?: string,
    type: ItemType,
    updatedBy: string,
    updatedDate: number,
};

type Props = {
    className?: string,
    closeDropdown?: Function,
    intl: any,
    itemData: QuickSearchItemData | RecordOf<QuickSearchItemData>,
    parentFolderRenderer?: Function,
    shouldNavigateOnItemClick?: boolean,
};

const QuickSearchItem = ({
    className,
    closeDropdown,
    intl,
    itemData,
    parentFolderRenderer,
    shouldNavigateOnItemClick,
    ...rest
}: Props) => {
    const { formatMessage } = intl;
    const {
        extension,
        iconType,
        id,
        name,
        nameWithMarkedQuery,
        parentName,
        sharedLink,
        type,
        updatedBy,
        updatedDate,
    } = itemData;
    const updatedDateInMs = convertToMs(updatedDate);
    const markedQueryMatches = [];
    nameWithMarkedQuery.split(QUERY_SEPARATOR).forEach((element, index) =>
        index % 2 === 0
            ? markedQueryMatches.push(element)
            : markedQueryMatches.push(
                  <mark key={index} className="search-term">
                      {element}
                  </mark>,
              ),
    );

    let itemIconTitle;
    switch (type) {
        case TYPE_WEBLINK:
            itemIconTitle = <FormattedMessage {...messages.bookmark} />;
            break;
        case TYPE_FILE:
            itemIconTitle = <FormattedMessage {...messages.file} />;
            break;
        case TYPE_FOLDER:
            if (iconType === 'folder-collab') {
                itemIconTitle = <FormattedMessage {...messages.collaboratedFolder} />;
            } else if (iconType === 'folder-external') {
                itemIconTitle = <FormattedMessage {...messages.externalFolder} />;
            } else {
                itemIconTitle = <FormattedMessage {...messages.personalFolder} />;
            }
            break;
        default:
    }

    let updatedText;
    if (isToday(updatedDateInMs)) {
        updatedText = formatMessage(messages.updatedTextToday, {
            user: updatedBy,
        });
    } else if (isYesterday(updatedDateInMs)) {
        updatedText = formatMessage(messages.updatedTextYesterday, {
            user: updatedBy,
        });
    } else {
        updatedText = formatMessage(messages.updatedText, {
            date: updatedDateInMs,
            user: updatedBy,
        });
    }

    let href;
    let targetProps = {};
    const isBoxNote = extension === 'boxnote';

    switch (type) {
        case 'folder':
            href = `/folder/${id}`;
            break;
        case 'web_link':
            href = `/web_link/${id}`;
            targetProps = { target: '_blank' };
            break;
        case 'file':
            // shared link should take precedence over other link types
            if (sharedLink) {
                href = sharedLink;
            } else if (isBoxNote) {
                href = `/notes/${id}`;
            } else {
                href = `/file/${id}`;
            }

            if (isBoxNote) targetProps = { target: '_blank' };
            break;
        default:
    }

    const itemName =
        href && shouldNavigateOnItemClick ? (
            <Link onClick={e => e.stopPropagation()} className="item-name" href={href} title={name} {...targetProps}>
                {markedQueryMatches}
            </Link>
        ) : (
            <span className="item-name" title={name}>
                {markedQueryMatches}
            </span>
        );

    return (
        <DatalistItem className={classNames('quick-search-item', className)} {...rest}>
            <ItemIcon iconType={iconType} title={itemIconTitle} />

            <span className="item-info">
                {itemName}

                <span className="item-subtext">
                    {(parentName || parentFolderRenderer) && (
                        <>
                            <Folder16 title={<FormattedMessage {...messages.parentFolder} />} height={12} width={12} />

                            {parentFolderRenderer ? (
                                parentFolderRenderer(itemData, closeDropdown)
                            ) : (
                                <span className="parent-folder">{parentName}</span>
                            )}

                            <span className="separator">•</span>
                        </>
                    )}

                    <span className="txt-ellipsis" title={updatedText}>
                        {updatedText}
                    </span>
                </span>
            </span>
        </DatalistItem>
    );
};

export default injectIntl(QuickSearchItem);
