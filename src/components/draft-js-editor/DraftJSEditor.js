// @flow
import * as React from 'react';
import classNames from 'classnames';

import { Editor } from 'draft-js';
import type { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

import Label from '../label';
import Tooltip from '../tooltip';

import './DraftJSEditor.scss';

type Props = {
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

    render() {
        const {
            editorState,
            error,
            hideLabel,
            inputProps,
            isDisabled,
            isRequired,
            label,
            onFocus,
            placeholder,
        } = this.props;

        const { handleBlur, handleChange } = this;

        const classes = classNames({
            'draft-js-editor': true,
            'is-disabled': isDisabled,
            'show-error': !!error,
        });

        let a11yProps = {};
        if (inputProps.role) {
            a11yProps = {
                ariaActiveDescendantID: inputProps['aria-activedescendant'],
                ariaAutoComplete: inputProps['aria-autocomplete'],
                ariaExpanded: inputProps['aria-expanded'],
                ariaOwneeID: inputProps['aria-owns'],
                role: inputProps.role,
            };
        }

        return (
            <div className={classes}>
                <Label hideLabel={hideLabel} showOptionalText={!isRequired} text={label}>
                    <Tooltip isShown={!!error} position="bottom-left" text={error ? error.message : ''} theme="error">
                        {/* need div so tooltip can set aria-describedby */}
                        <div>
                            <Editor
                                {...a11yProps}
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
                </Label>
            </div>
        );
    }
}

export default DraftJSEditor;
