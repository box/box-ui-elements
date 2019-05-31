import React from 'react';
import PropTypes from 'prop-types';
import uniqueid from 'lodash/uniqueId';
import { FormattedDate, FormattedMessage } from 'react-intl';

import ClassificationProperty from '../classification/ClassificationProperty';

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
    classificationProps = {},
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
    trashedAt,
    uploader,
    url,
}) => {
    const descriptionId = uniqueid('description_');

    return (
        <dl className="item-properties">
            {description || onDescriptionChange ? (
                <React.Fragment>
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
                </React.Fragment>
            ) : null}
            {!!url && (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.url} />
                    <dd>{onValidURLChange ? <EditableURL onValidURLChange={onValidURLChange} value={url} /> : url}</dd>
                </React.Fragment>
            )}
            {owner ? (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.owner} />
                    <dd>{owner}</dd>
                </React.Fragment>
            ) : null}
            {enterpriseOwner ? (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.enterpriseOwner} />
                    <dd>{enterpriseOwner}</dd>
                </React.Fragment>
            ) : null}
            {uploader ? (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.uploader} />
                    <dd>{uploader}</dd>
                </React.Fragment>
            ) : null}
            {createdAt ? (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.created} />
                    <dd>
                        <FormattedDate value={new Date(createdAt)} {...datetimeOptions} />
                    </dd>
                </React.Fragment>
            ) : null}
            {modifiedAt ? (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.modified} />
                    <dd>
                        <FormattedDate value={new Date(modifiedAt)} {...datetimeOptions} />
                    </dd>
                </React.Fragment>
            ) : null}
            {size ? (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.size} />
                    <dd>{size}</dd>
                </React.Fragment>
            ) : null}
            {trashedAt ? (
                <React.Fragment>
                    <FormattedMessage tagName="dt" {...messages.deleted} />
                    <dd>
                        <FormattedDate value={new Date(trashedAt)} {...datetimeOptions} />
                    </dd>
                </React.Fragment>
            ) : null}
            <RetentionPolicy {...retentionPolicyProps} />
            <ClassificationProperty {...classificationProps} />
        </dl>
    );
};

ItemProperties.propTypes = {
    /** props for the ClassificationProperty component */
    classificationProps: PropTypes.shape({
        /** function that opens the classification modal, should only be set if user can edit classification */
        openModal: PropTypes.func,
        /** the tooltip to show for the banner policy body if it exists */
        tooltip: PropTypes.string,
        /** the classification value shown as a badge if an item has classification */
        value: PropTypes.string,
    }),
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
    /** the datetime this item was deleted or moved to trash, accepts any value that can be passed to the Date() constructor */
    trashedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** the name of the user who uploaded this item */
    uploader: PropTypes.string,
    /** the URL for the item when the item is a weblink */
    url: PropTypes.string,
};

export default ItemProperties;
