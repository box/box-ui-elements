// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconAddMetadataEmptyState from '../../icons/general/IconAddMetadataEmptyState';

import messages from './messages';
import './EmptyContent.scss';

type Props = {
    canAdd?: boolean,
};

const EmptyContent = ({ canAdd }: Props) => (
    <div className="metadata-instance-editor-no-instances">
        <IconAddMetadataEmptyState />
        <p className="metadata-instance-editor-no-instances--call-out">
            <FormattedMessage {...messages.noMetadata} />
        </p>
        {canAdd && (
            <p className="metadata-instance-editor-no-instances--how-add-template">
                <FormattedMessage {...messages.noMetadataAddTemplate} />
            </p>
        )}
    </div>
);

export default EmptyContent;
