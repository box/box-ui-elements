import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import { Editor } from 'draft-js';
import type { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

import { Tooltip, TooltipProvider } from '@box/blueprint-web';

import commonMessages from '../../common/messages';
import './DraftJSEditor.scss';

const OptionalFormattedMessage = () => (
    <span className="bdl-Label-optional">
        (<FormattedMessage {...commonMessages.optional} />)
    </span>
);
export interface DraftJSEditorProps {
    /** Description announced to screen-reader users */
    description?: React.ReactNode;
    /** Current DraftJS editor state */
    editorState: EditorState;
    /** Error displayed in the tooltip */
    error?: object | null;
    /** Whether the visible label should be hidden */
    hideLabel?: boolean;
    /** Props forwarded to the DraftJS editor */
    inputProps: object;
    /** Whether the editor is disabled */
    isDisabled?: boolean;
    /** Whether the editor is required */
    isRequired?: boolean;
    /** Editor label */
    label: React.ReactNode;
    /** Called when the editor loses focus */
    onBlur: Function;
    /** Called when the editor state changes */
    onChange: Function;
    /** Called when the editor receives focus */
    onFocus: Function;
    /** Called before DraftJS handles the return key */
    onReturn?: Function;
    /** Editor placeholder */
    placeholder?: string;
}

class DraftJSEditor extends React.Component<DraftJSEditorProps> {
    static defaultProps = {
        inputProps: {},
        isRequired: false,
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

    handleBlur = (event: React.SyntheticEvent) => {
        const { onBlur } = this.props;

        onBlur(event);
    };

    /**
     * Event handler which being passed to 'handleReturn' prop of DraftJSEditor
     * This gives consumer the ability to handle return key event before DraftJSEditor handles it.
     * @param {SyntheticKeyboardEvent} event
     * @returns {string}
     */
    handleReturn = (event: React.KeyboardEvent) => {
        const { onReturn, inputProps } = this.props;
        const editorInputProps = inputProps as Record<string, unknown>;

        if (onReturn && !editorInputProps['aria-activedescendant']) {
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
        const editorInputProps = inputProps as Record<string, unknown>;
        const errorMessage = error ? (error as { message?: React.ReactNode }).message : '';
        const handleFocus = onFocus as (event: React.SyntheticEvent) => void;

        const classes = classNames({
            'draft-js-editor': true,
            'is-disabled bdl-is-disabled': isDisabled,
            'show-error': !!error,
        });

        let a11yProps: Record<string, unknown> = {};
        if (editorInputProps.role) {
            a11yProps = {
                ariaActiveDescendantID: editorInputProps['aria-activedescendant'],
                ariaAutoComplete: editorInputProps['aria-autocomplete'],
                ariaExpanded: editorInputProps['aria-expanded'],
                ariaOwneeID: editorInputProps['aria-owns'],
                ariaMultiline: true,
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

                <TooltipProvider>
                    <Tooltip open={!!error} side="bottom" align="start" content={errorMessage} variant="error">
                        <div>
                            <Editor
                                {...a11yProps}
                                ariaLabelledBy={this.labelID}
                                ariaDescribedBy={this.descriptionID}
                                editorState={editorState}
                                handleReturn={this.handleReturn}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                placeholder={placeholder}
                                readOnly={isDisabled}
                                stripPastedStyles
                            />
                        </div>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }
}

export default DraftJSEditor;
