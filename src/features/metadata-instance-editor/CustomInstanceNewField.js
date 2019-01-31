// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import Button from 'components/button/Button';
import TextInput from 'components/text-input/TextInput';
import Tooltip from 'components/tooltip/Tooltip';
import commonMessages from '../../common/messages';
import IconInfo from '../../icons/general/IconInfo';

import messages from './messages';
import './CustomInstanceNewField.scss';

type Props = {
    intl: any,
    isCancellable: boolean,
    onAdd: (key: string, value: MetadataFieldValue) => void,
    onCancel: () => void,
    properties: MetadataFields,
};

type State = {
    key: string,
    value: string,
    error: React.Node,
};

class CustomInstanceNewField extends React.PureComponent<Props, State> {
    state: State = {
        key: '',
        value: '',
        error: '',
    };

    /**
     * Common change handler
     *
     * @param {Event} event - keyboard event
     * @param {string} attr - key or value
     * @return {void}
     */
    onChange(event: SyntheticKeyboardEvent<HTMLInputElement>, attr: string) {
        const currentTarget = (event.currentTarget: HTMLInputElement);
        this.setState({
            error: '',
            [attr]: currentTarget.value,
        });
    }

    /**
     * Change handler for the key
     *
     * @param {Event} event - keyboard event
     * @return {void}
     */
    onKeyChange = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.onChange(event, 'key');
    };

    /**
     * Change handler for the value
     *
     * @param {Event} event - keyboard event
     * @return {void}
     */
    onValueChange = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.onChange(event, 'value');
    };

    /**
     * Persists the new metadata added or shows an error
     *
     * @return {void}
     */
    onAdd = () => {
        const { key, value }: State = this.state;
        const { onAdd, properties }: Props = this.props;
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            this.setState({
                error: <FormattedMessage {...messages.customErrorDuplicateKey} />,
            });
        } else if (key.startsWith('$')) {
            this.setState({
                error: <FormattedMessage {...messages.customErrorInternalKey} />,
            });
        } else if (key) {
            onAdd(key, value);
        } else {
            this.setState({
                error: <FormattedMessage {...messages.customErrorRequired} />,
            });
        }
    };

    render() {
        const { intl, isCancellable, onCancel }: Props = this.props;
        const { key, value, error }: State = this.state;
        return (
            <div className="custom-new-field">
                <div className="custom-new-field-header">
                    <FormattedMessage tagName="h5" {...messages.customNewField} />
                    <Tooltip text={<FormattedMessage {...messages.customNewFieldMessage} />}>
                        <div tabIndex="-1">
                            <IconInfo color="#777" width={18} height={18} />
                        </div>
                    </Tooltip>
                </div>
                <TextInput
                    error={error}
                    label={<FormattedMessage {...messages.customKey} />}
                    isRequired
                    onChange={this.onKeyChange}
                    placeholder={intl.formatMessage(messages.customKeyPlaceholder)}
                    type="text"
                    value={key}
                />
                <TextInput
                    hideOptionalLabel
                    label={<FormattedMessage {...messages.customValue} />}
                    onChange={this.onValueChange}
                    placeholder={intl.formatMessage(messages.customValuePlaceholder)}
                    type="text"
                    value={value}
                />
                <div className="custom-new-field-actions">
                    {isCancellable && (
                        <Button type="button" data-resin-target="metadata-customfieldcancel" onClick={onCancel}>
                            <FormattedMessage {...commonMessages.cancel} />
                        </Button>
                    )}
                    <Button type="button" data-resin-target="metadata-customfieldadd" onClick={this.onAdd}>
                        <FormattedMessage {...messages.customAdd} />
                    </Button>
                </div>
            </div>
        );
    }
}

export { CustomInstanceNewField as CustomInstanceNewFieldBase };
export default injectIntl(CustomInstanceNewField);
