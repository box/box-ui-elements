import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ContentState, EditorState } from 'draft-js';

import Avatar from 'components/avatar';
import Section from 'components/section';
import PrimaryButton from 'components/primary-button';
import { DraftMentionDecorator } from 'components/form-elements/draft-js-mention-selector';

import MentionSelectorContainer from './MentionSelectorContainer';

const CustomSelectorRow = ({ item }) => (
    <div>
        <div
            style={{
                display: 'inline-block',
                marginRight: '10px',
                verticalAlign: 'middle',
            }}
        >
            <Avatar {...item} />
        </div>
        <span>{item.name}</span>
    </div>
);

CustomSelectorRow.propTypes = {
    item: PropTypes.object,
};

class DraftJSMentionSelectorExamples extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exampleExternalEditorState: this.initialEditorState,
        };
    }

    onExternalEditorStateChange = newEditorState => {
        this.setState({ exampleExternalEditorState: newEditorState });
    };

    getMentionReplacement(mention) {
        return {
            component: ({ id, name, ...rest }) => {
                const style = {
                    display: 'inline-block',
                    verticalAlign: 'middle',
                };
                return (
                    <div {...rest} style={style}>
                        <Avatar id={id} name={name} />
                    </div>
                );
            },
            data: {
                ...mention,
            },
            serializedText: () => {
                return `@[${mention.id}:${mention.name}]`;
            },
            text: '',
        };
    }

    initialEditorState = EditorState.createWithContent(
        ContentState.createFromText('Is this thing on?'),
        DraftMentionDecorator,
    );

    initializeEditorState = () => {
        this.setState({ exampleExternalEditorState: this.initialEditorState });
    };

    render() {
        const { exampleExternalEditorState } = this.state;

        return (
            <div className="example-section mention-selector">
                <h3>Mention Selector</h3>
                <Section id="mention-selector-external-editor-state-draft" title="External Editor State">
                    <MentionSelectorContainer
                        isRequired
                        editorState={exampleExternalEditorState}
                        onChange={this.onExternalEditorStateChange}
                        name="comments1"
                    />
                    <PrimaryButton onClick={this.initializeEditorState}>Reset State</PrimaryButton>
                </Section>
                <Section id="mention-selector-required-draft" title="Required">
                    <MentionSelectorContainer isRequired name="comments1" placeholder="Enter a comment (uses draft)" />
                </Section>
                <Section id="mention-selector-required-draft" title="Handle Return Key">
                    <MentionSelectorContainer
                        name="comments1"
                        placeholder="Enter a comment (uses draft)"
                        onReturn={event => !event.shiftKey}
                    />
                </Section>
                <Section id="mention-selector-disabled-draft" title="Disabled">
                    <MentionSelectorContainer name="comments1" isDisabled placeholder="this one is disabled" />
                </Section>
                <Section id="mention-selector-required-all-props" title="All possible props set">
                    <MentionSelectorContainer
                        isRequired
                        name="comments1"
                        label="several props"
                        placeholder="Lots of props"
                        onChange={x => {
                            console.log('a change: ', x.toJS()); // eslint-disable-line
                        }}
                        onFocus={() => {
                            console.log('the draft mention selector was focused'); // eslint-disable-line
                        }}
                    />
                </Section>
            </div>
        );
    }
}

export default DraftJSMentionSelectorExamples;
