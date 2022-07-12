import React from 'react';
import { FormattedMessage } from 'react-intl';
import Media from '../../media';
import Avatar from '../../avatar';
import Button from '../../button';
import PrimaryButton from '../../primary-button';
// @ts-ignore
import { Form } from '../../form-elements';
// @ts-ignore
import DraftJSMentionSelector from '../../form-elements/draft-js-mention-selector';

// @ts-ignore
import messages from './messages';
import './CommentForm.scss';

type CommentFormProps = {
    avatarUrl: string;
    onSubmit: ({ id, content }: { id: string | null; content: string }) => void;
    onCancel: () => void;
    entityId: string;
    description: string;
    shouldShowAvatar: boolean;
    shouldBeOpen: boolean;
};

const CommentForm = ({
    avatarUrl,
    onSubmit,
    onCancel,
    entityId,
    description,
    shouldBeOpen,
    shouldShowAvatar,
}: CommentFormProps) => {
    const [commentEditorState, setCommentEditorState] = React.useState();
    const [isOpen, setIsOpen] = React.useState(shouldBeOpen);

    const handleChange = e => {
        setCommentEditorState(e);
    };

    const onFormValidSubmitHandler = (): void => {
        if (!commentEditorState) {
            return;
        }
        if (onSubmit) {
            onSubmit({ id: entityId, content: commentEditorState });
        }
    };

    return (
        <div className="CommentForm">
            <Media>
                {shouldShowAvatar && (
                    <Media.Figure>
                        <Avatar avatarUrl={avatarUrl} />
                    </Media.Figure>
                )}
                <Media.Body>
                    <Form onValidSubmit={onFormValidSubmitHandler}>
                        <DraftJSMentionSelector
                            className="bcs-CommentForm-input"
                            // contacts={isOpen ? mentionSelectorContacts : []}
                            // contactsLoaded={contactsLoaded}
                            editorState={commentEditorState}
                            hideLabel
                            // isDisabled={isDisabled}
                            isRequired={isOpen}
                            name="commentText"
                            // label={formatMessage(messages.commentLabel)}
                            description={description}
                            onChange={handleChange}
                            onFocus={() => setIsOpen(true)}
                            // onMention={getMentionWithQuery}
                            placeholder={entityId ? undefined : messages.commentWrite}
                            validateOnBlur={false}
                        />
                        {isOpen && (
                            <div className="CommentForm__actions">
                                <Button onClick={onCancel}>
                                    <FormattedMessage {...messages.commentCancel} />
                                </Button>
                                <PrimaryButton /* disabled if no text */>
                                    <FormattedMessage {...messages.commentPost} />
                                </PrimaryButton>
                            </div>
                        )}
                    </Form>
                </Media.Body>
            </Media>
        </div>
    );
};

export default CommentForm;
