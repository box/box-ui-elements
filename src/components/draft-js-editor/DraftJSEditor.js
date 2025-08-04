// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import { Editor } from 'draft-js';
import type { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

import Tooltip from '../tooltip';

import commonMessages from '../../common/messages';
import './DraftJSEditor.scss';

const OptionalFormattedMessage = () => (
    <span className="bdl-Label-optional">
        (<FormattedMessage {...commonMessages.optional} />)
    </span>
);
type Props = {
    customStyleMap?: Object,
    description?: React.Node,
    editorState: EditorState,
    error?: ?Object,
    hideLabel?: boolean,
    inputProps: Object,
    isDisabled?: boolean,
    isRequired?: boolean,
    label: React.Node,
    onBlur: Function,
    onChange: Function,
    onFocus: Function,
    onReturn?: Function,
    placeholder?: string,
};

class DraftJSEditor extends React.Component<Props> {
    static defaultProps = {
        inputProps: {},
        isRequired: false,
        isFocused: false,
    };

    /**
     * Calls onChange handler passed in
     * @param {EditorState} editorState The new/updated editor state
     * @returns {void}
     */
    handleChange = (editorState: EditorState) => {
        const { onChange } = this.props;

        onChange(editorState);
    };

    handleBlur = (editorState: EditorState) => {
        const { onBlur } = this.props;

        onBlur(editorState);
    };

    /**
     * Event handler which being passed to 'handleReturn' prop of DraftJSEditor
     * This gives consumer the ability to handle return key event before DraftJSEditor handles it.
     * @param {SyntheticKeyboardEvent} event
     * @returns {string}
     */
    handleReturn = (event: SyntheticKeyboardEvent<>) => {
        const { onReturn, inputProps } = this.props;

        if (onReturn && !inputProps['aria-activedescendant']) {
            // Return 'handled' tells DraftJS Editor to not handle return key event,
            // return 'not-handled' tells DraftJS Editor to continue handle the return key event.
            // We encapsulate this DraftJS Editor specific contract here, and use true/fase
            // to indicate whether to let DraftJS Editor handle return event or not in the upper level.
            return onReturn(event) ? 'handled' : 'not-handled';
        }

        return 'not-handled';
    };

    labelID = uniqueId('label');

    descriptionID = uniqueId('description');

    render() {
        const {
            customStyleMap,
            editorState,
            error,
            hideLabel,
            inputProps,
            isDisabled,
            isRequired,
            label,
            description,
            onFocus,
            placeholder,
        } = this.props;

        const { handleBlur, handleChange } = this;

        const classes = classNames({
            'draft-js-editor': true,
            'is-disabled bdl-is-disabled': isDisabled,
            'show-error': !!error,
        });

        let a11yProps = {};
        if (inputProps.role) {
            a11yProps = {
                ariaActiveDescendantID: inputProps['aria-activedescendant'],
                ariaAutoComplete: inputProps['aria-autocomplete'],
                ariaExpanded: inputProps['aria-expanded'],
                ariaOwneeID: inputProps['aria-owns'],
                role: 'textbox',
            };
        }

        return (
            <div className={classes}>
                <span className={classNames('bdl-Label', { 'accessibility-hidden': hideLabel })} id={this.labelID}>
                    {label}
                    {!isRequired && <OptionalFormattedMessage />}
                </span>
                <span className="accessibility-hidden screenreader-description" id={this.descriptionID}>
                    {description}
                </span>

                <Tooltip isShown={!!error} position="bottom-left" text={error ? error.message : ''} theme="error">
                    {/* need div so tooltip can set aria-describedby */}
                    <div>
                        <Editor
                            {...a11yProps}
                            ariaLabelledBy={this.labelID}
                            ariaDescribedBy={this.descriptionID}
                            customStyleMap={customStyleMap}
                            editorState={editorState}
                            handleReturn={this.handleReturn}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onFocus={onFocus}
                            placeholder={placeholder}
                            readOnly={isDisabled}
                            stripPastedStyles
                        />
                    </div>
                </Tooltip>
            </div>
        );
    }
}

export default DraftJSEditor;
