// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import MetadataField from '../metadata-instance-fields/MetadataField';
import messages from './messages';
import { isHidden } from './metadataUtil';
import type { MetadataFields, MetadataTemplate, MetadataFieldValue } from '../../common/types/metadata';
import MetadataInstanceEditorContext from './MetadataInstanceEditorContext';
import './TemplatedInstance.scss';

type Props = {
    canEdit: boolean,
    data: MetadataFields,
    errors: { [string]: React.Node },
    isDisabled?: boolean,
    onFieldChange?: (key: string, value: MetadataFieldValue, type: string) => void,
    onFieldRemove?: (key: string) => void,
    template: MetadataTemplate,
};

const TemplatedInstance = ({
    canEdit,
    data = {},
    errors,
    isDisabled,
    onFieldChange,
    onFieldRemove,
    template,
}: Props) => {
    const { fields = [] } = template;
    const hasFields = fields.length > 0;
    const hasVisibleFields = hasFields && fields.some(field => !isHidden(field));
    const showNoFieldsMessage = !hasFields;
    const showHiddenFieldsMessage = hasFields && !hasVisibleFields;
    const { blurExceptionClassNames } = React.useContext(MetadataInstanceEditorContext);

    return (
        <>
            {hasVisibleFields &&
                fields.map(field => (
                    <MetadataField
                        key={field.id}
                        blurExceptionClassNames={blurExceptionClassNames}
                        canEdit={canEdit}
                        dataKey={field.key}
                        dataValue={data[field.key]}
                        description={field.description}
                        displayName={field.displayName}
                        error={errors[field.key]}
                        isDisabled={isDisabled}
                        isHidden={isHidden(field)} // Checking both isHidden and hidden attributes due to differences in V2 and V3 APIs
                        onChange={(key: string, value: MetadataFieldValue) => {
                            if (canEdit && onFieldChange) {
                                onFieldChange(key, value, field.type);
                            }
                        }}
                        onRemove={(key: string) => {
                            if (canEdit && onFieldRemove) {
                                onFieldRemove(key);
                            }
                        }}
                        options={field.options}
                        type={field.type}
                    />
                ))}
            {showHiddenFieldsMessage && (
                <div className="attributes-hidden-message">
                    <FormattedMessage {...messages.allAttributesAreHidden} />
                </div>
            )}
            {showNoFieldsMessage && (
                <div className="no-attributes-message">
                    <FormattedMessage {...messages.noAttributesForTemplate} />
                </div>
            )}
        </>
    );
};

export default TemplatedInstance;
