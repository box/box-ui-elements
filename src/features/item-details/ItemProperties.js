import * as React from 'react';
import PropTypes from 'prop-types';
import uniqueid from 'lodash/uniqueId';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { ITEM_TYPE_FOLDER } from '../../common/constants';

import EditableDescription from './EditableDescription';
import EditableURL from './EditableURL';
import RetentionPolicy from './RetentionPolicy';
import ReadonlyDescription from './ReadonlyDescription';
import messages from './messages';

import './ItemProperties.scss';

const datetimeOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};

const ItemProperties = ({
    archivedAt,
    createdAt,
    description,
    descriptionTextareaProps = {},
    enterpriseOwner,
    modifiedAt,
    onDescriptionChange,
    onValidURLChange,
    owner,
    retentionPolicyProps = {},
    size,
    filesCount,
    trashedAt,
    type,
    uploader,
    url,
}) => {
    const descriptionId = uniqueid('description_');

    return (
        <dl className="item-properties">
            {description || onDescriptionChange ? (
                <>
                    <FormattedMessage {...messages.description}>
                        {text => <dt id={descriptionId}>{text}</dt>}
                    </FormattedMessage>
                    <dd>
                        {onDescriptionChange ? (
                            <EditableDescription
                                onDescriptionChange={onDescriptionChange}
                                textAreaProps={{ ...descriptionTextareaProps, 'aria-labelledby': descriptionId }}
                                value={description}
                            />
                        ) : (
                            <ReadonlyDescription value={description} />
                        )}
                    </dd>
                </>
            ) : null}
            {!!url && (
                <>
                    <FormattedMessage tagName="dt" {...messages.url} />
                    <dd>{onValidURLChange ? <EditableURL onValidURLChange={onValidURLChange} value={url} /> : url}</dd>
                </>
            )}
            {owner ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.owner} />
                    <dd>{owner}</dd>
                </>
            ) : null}
            {enterpriseOwner ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.enterpriseOwner} />
                    <dd>{enterpriseOwner}</dd>
                </>
            ) : null}
            {uploader ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.uploader} />
                    <dd>{uploader}</dd>
                </>
            ) : null}
            {createdAt ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.created} />
                    <dd>
                        <FormattedDate value={new Date(createdAt)} {...datetimeOptions} />
                    </dd>
                </>
            ) : null}
            {modifiedAt ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.modified} />
                    <dd>
                        <FormattedDate value={new Date(modifiedAt)} {...datetimeOptions} />
                    </dd>
                </>
            ) : null}
            {archivedAt ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.archived} />
                    <dd>
                        <FormattedDate value={new Date(archivedAt)} {...datetimeOptions} />
                    </dd>
                </>
            ) : null}
            {size ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.size} />
                    <dd>
                        <div>{size}</div>
                        {filesCount !== null && type === ITEM_TYPE_FOLDER ? (
                            <FormattedMessage values={{ filesCount }} {...messages.filesCountLabel} />
                        ) : null}
                    </dd>
                </>
            ) : null}
            {trashedAt ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.deleted} />
                    <dd>
                        <FormattedDate value={new Date(trashedAt)} {...datetimeOptions} />
                    </dd>
                </>
            ) : null}
            <RetentionPolicy {...retentionPolicyProps} />
        </dl>
    );
};

ItemProperties.propTypes = {
    /** the datetime this item was archived, accepts any value that can be passed to the Date() constructor */
    archivedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** the datetime this item was created, accepts any value that can be passed to the Date() constructor */
    createdAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** a description for the item */
    description: PropTypes.string,
    /** props for the editable description textarea */
    descriptionTextareaProps: PropTypes.object,
    /** the name of the item's enterprise owner if the item is owned by a different enterprise */
    enterpriseOwner: PropTypes.string,
    /** the datetime this item was last modified, accepts any value that can be passed to the Date() constructor */
    modifiedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** function called on description textarea blur with the new value to save */
    onDescriptionChange: PropTypes.func,
    /** function called on url input blur with the new value to save */
    onValidURLChange: PropTypes.func,
    /** the name of the item's owner */
    owner: PropTypes.string,
    /** props for the retention policy of this item */
    retentionPolicyProps: PropTypes.object,
    /** use the getFileSize util to get a localized human-readable string from the number of bytes */
    size: PropTypes.string,
    /** the number of files in a folder */
    filesCount: PropTypes.number,
    /** the datetime this item was deleted or moved to trash, accepts any value that can be passed to the Date() constructor */
    trashedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** the type of the item */
    type: PropTypes.string,
    /** the name of the user who uploaded this item */
    uploader: PropTypes.string,
    /** the URL for the item when the item is a weblink */
    url: PropTypes.string,
};

export default ItemProperties;
