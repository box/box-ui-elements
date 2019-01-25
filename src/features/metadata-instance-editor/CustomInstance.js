// @flow
import * as React from 'react';

import CustomNewField from './CustomInstanceNewField';
import CustomField from './fields/CustomField';
import EmptyContent from './EmptyContent';
import type { Fields, FieldValue } from './flowTypes';
import { FIELD_TYPE_STRING } from './constants';

type Props = {
    canEdit: boolean,
    onFieldChange?: (key: string, value: FieldValue, type: string) => void,
    onFieldRemove?: (key: string) => void,
    data: Fields,
};

type State = {
    isAddFieldVisible: boolean,
    properties: Fields,
};

class CustomInstance extends React.PureComponent<Props, State> {
    static defaultProps = {
        canEdit: true,
        data: {},
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            isAddFieldVisible: false,
            properties: { ...props.data },
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            isAddFieldVisible: false,
            properties: { ...nextProps.data },
        });
    }

    /**
     * Adds/updates a new metadata key value pair
     *
     * @param {string} key - metadata key
     * @param {string} value - metadata value
     * @return {void}
     */
    onFieldChange = (key: string, value: FieldValue) => {
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
            <React.Fragment>
                {fields.map((key, index) => (
                    <CustomField
                        key={key}
                        isLast={!isAddFieldVisible && index === fields.length - 1}
                        canEdit={canEdit}
                        dataKey={key}
                        dataValue={properties[key]}
                        onChange={this.onFieldChange}
                        onRemove={this.onFieldRemove}
                        onAdd={this.onAddFieldToggle}
                    />
                ))}
                {!canAddFields && fields.length === 0 && <EmptyContent />}
                {canAddFields && (
                    <CustomNewField
                        isCancellable={fields.length !== 0}
                        properties={this.props.data}
                        onAdd={this.onFieldChange}
                        onCancel={this.onAddFieldToggle}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default CustomInstance;
