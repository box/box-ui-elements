import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { convertToMs, isToday, isYesterday } from '../../utils/datetime';
import DatalistItem from '../../components/datalist-item';
import IconSmallFolder from '../../icons/folder/IconSmallFolder';
import ItemIcon from '../../icons/item-icon';
import { Link } from '../../components/link';

import messages from './messages';

import './QuickSearchItem.scss';

const QUERY_SEPARATOR = '<mark>';

const QuickSearchItem = ({
    className,
    closeDropdown,
    intl,
    itemData,
    parentFolderRenderer,
    shouldNavigateOnItemClick,
    ...rest
}) => {
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
        case 'web_link':
            itemIconTitle = <FormattedMessage {...messages.bookmark} />;
            break;
        case 'file':
            itemIconTitle = <FormattedMessage {...messages.file} />;
            break;
        case 'folder':
            if (iconType === 'folder-collab') {
                itemIconTitle = <FormattedMessage {...messages.collaboratedFolder} />;
            } else if (iconType === 'folder-external') {
                itemIconTitle = <FormattedMessage {...messages.externalFolder} />;
            } else {
                itemIconTitle = <FormattedMessage {...messages.personalFolder} />;
            }
            break;
        default:
            itemIconTitle = null;
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
                            <IconSmallFolder title={<FormattedMessage {...messages.parentFolder} />} />

                            {parentFolderRenderer ? (
                                parentFolderRenderer(itemData, closeDropdown)
                            ) : (
                                <span className="parent-folder">{parentName}</span>
                            )}

                            <span className="separator">·</span>
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

const itemDataShape = {
    extension: PropTypes.string,
    iconType: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameWithMarkedQuery: PropTypes.string.isRequired,
    parentName: PropTypes.string.isRequired,
    sharedLink: PropTypes.string,
    type: PropTypes.string.isRequired,
    updatedBy: PropTypes.string.isRequired,
    updatedDate: PropTypes.number.isRequired,
};
QuickSearchItem.propTypes = {
    closeDropdown: PropTypes.func,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    itemData: PropTypes.oneOfType([ImmutablePropTypes.recordOf(itemDataShape), PropTypes.shape(itemDataShape)])
        .isRequired,
    parentFolderRenderer: PropTypes.func,
    shouldNavigateOnItemClick: PropTypes.bool,
};

export default injectIntl(QuickSearchItem);
