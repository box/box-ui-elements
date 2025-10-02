// @flow
import * as React from 'react';
import isEqual from 'lodash/isEqual';

import CustomNewField from './CustomInstanceNewField';
import CustomMetadataField from '../metadata-instance-fields/CustomMetadataField';
import EmptyContent from './EmptyContent';
import { FIELD_TYPE_STRING } from '../metadata-instance-fields/constants';
import type { MetadataFieldValue, MetadataFields } from '../../common/types/metadata';

type Props = {
    canEdit: boolean,
    data: MetadataFields,
    onFieldChange?: (key: string, value: MetadataFieldValue, type: string) => void,
    onFieldRemove?: (key: string) => void,
};

type State = {
    isAddFieldVisible: boolean,
    properties: MetadataFields,
};

class CustomInstance extends React.PureComponent<Props, State> {
    static defaultProps = {
        canEdit: true,
        data: {},
    };

    static getDerivedStateFromProps({ data }: Props, { properties }: State): any {
        if (!isEqual(data, properties)) {
            return {
                properties: { ...data },
            };
        }

        return null;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            isAddFieldVisible: false,
            properties: { ...props.data },
        };
    }

    /**
     * Adds/updates a new metadata key value pair
     *
     * @param {string} key - metadata key
     * @param {string} value - metadata value
     * @return {void}
     */
    onFieldChange = (key: string, value: MetadataFieldValue) => {
        const { canEdit, onFieldChange }: Props = this.props;
        if (canEdit && onFieldChange) {
            onFieldChange(key, value, FIELD_TYPE_STRING);
        }
    };

    /**
     * Adds/updates a new metadata key value pair
     *
     * @param {string} key - metadata key
     * @param {string} value - metadata value
     * @return {void}
     */
    onFieldRemove = (key: string) => {
        const { canEdit, onFieldRemove }: Props = this.props;
        if (canEdit && onFieldRemove) {
            onFieldRemove(key);
        }
    };

    /**
     * Shows the add new field field
     *
     * @return {void}
     */
    onAddFieldToggle = () => {
        this.setState(prevState => ({
            isAddFieldVisible: !prevState.isAddFieldVisible,
        }));
    };

    render() {
        const { canEdit }: Props = this.props;
        const { isAddFieldVisible, properties }: State = this.state;
        const fields = Object.keys(properties);
        const canAddFields = canEdit && (isAddFieldVisible || fields.length === 0);

        return (
            <>
                {fields.map((key, index) => (
                    <CustomMetadataField
                        key={key}
                        canEdit={canEdit}
                        dataKey={key}
                        dataValue={properties[key]}
                        isLast={!isAddFieldVisible && index === fields.length - 1}
                        onAdd={this.onAddFieldToggle}
                        onChange={this.onFieldChange}
                        onRemove={this.onFieldRemove}
                    />
                ))}
                {!canAddFields && fields.length === 0 && <EmptyContent />}
                {canAddFields && (
                    <CustomNewField
                        isCancellable={fields.length !== 0}
                        onAdd={this.onFieldChange}
                        onCancel={this.onAddFieldToggle}
                        properties={this.props.data}
                    />
                )}
            </>
        );
    }
}

export default CustomInstance;
