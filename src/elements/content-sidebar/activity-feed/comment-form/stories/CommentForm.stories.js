// @flow
import * as React from 'react';
import { action } from 'storybook/actions';

import CommentForm, { CommentFormUnwrapped, type CommentFormProps } from '../CommentForm';

const intlFake = {
    formatMessage: message => message.defaultMessage,
};

const defaultUser = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
};

const defaultFile = {
    id: 'file_123',
    name: 'test-file.pdf',
    extension: 'pdf',
    type: 'file',
};

const getTemplate = customProps => (props: CommentFormProps) => (
    <CommentFormUnwrapped
        user={defaultUser}
        file={defaultFile}
        intl={intlFake}
        onCancel={action('onCancel')}
        createComment={action('createComment')}
        updateComment={action('updateComment')}
        onSubmit={action('onSubmit')}
        onFocus={action('onFocus')}
        getMentionWithQuery={action('getMentionWithQuery')}
        {...props}
        {...customProps}
    />
);

export const Default = getTemplate({});

export const Open = getTemplate({
    isOpen: true,
});

export const Editing = getTemplate({
    isOpen: true,
    isEditing: true,
    entityId: 'comment_123',
    tagged_message: 'This is an existing comment',
});

export const Disabled = getTemplate({
    isOpen: true,
    isDisabled: true,
});

export const VideoFile = () => {
    const features = {
        activityFeed: {
            timestampedComments: {
                enabled: true,
            },
        },
    };

    return (
        <div>
            <div className="bp-media-dash" style={{ width: '100px', height: '100px', marginBottom: '10px' }}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                    src="//cdn03.boxcdn.net/sites/default/files/homepage/v2/images/hero/run/laptop-screen-1680-v2@1x.mp4"
                    controls
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            <CommentFormUnwrapped
                intl={intlFake}
                user={defaultUser}
                file={{
                    ...defaultFile,
                    extension: 'mp4',
                }}
                features={features}
                isOpen={true}
                onCancel={action('onCancel')}
                createComment={action('createComment')}
                updateComment={action('updateComment')}
                onSubmit={action('onSubmit')}
                onFocus={action('onFocus')}
                getMentionWithQuery={action('getMentionWithQuery')}
            />
        </div>
    );
};

export default {
    title: 'Components/CommentForm',
    component: CommentForm,
    parameters: {
        docs: {
            description: {
                component: 'A form component for creating and editing comments in the activity feed.',
            },
        },
    },
    argTypes: {
        isOpen: {
            control: { type: 'boolean' },
            description: 'Whether the comment form is open',
        },
        isEditing: {
            control: { type: 'boolean' },
            description: 'Whether the form is in editing mode',
        },
        isDisabled: {
            control: { type: 'boolean' },
            description: 'Whether the form is disabled',
        },

        features: {
            control: { type: 'object' },
            description: 'Features object',
        },

        file: {
            control: { type: 'object' },
            description: 'File object',
        },

        tagged_message: {
            control: { type: 'text' },
            description: 'Initial message content for editing',
        },
        placeholder: {
            control: { type: 'text' },
            description: 'Placeholder text for the comment input',
        },
        shouldFocusOnOpen: {
            control: { type: 'boolean' },
            description: 'Whether to focus the input when opened',
        },
        showTip: {
            control: { type: 'boolean' },
            description: 'Whether to show a tip',
        },
        onCancel: {
            action: 'onCancel',
            description: 'Callback when cancel is clicked',
        },
        createComment: {
            action: 'createComment',
            description: 'Callback to create a new comment',
        },
        updateComment: {
            action: 'updateComment',
            description: 'Callback to update an existing comment',
        },
        onSubmit: {
            action: 'onSubmit',
            description: 'Callback when form is submitted',
        },
        onFocus: {
            action: 'onFocus',
            description: 'Callback when input is focused',
        },
        getMentionWithQuery: {
            action: 'getMentionWithQuery',
            description: 'Callback to get mentions based on query',
        },
    },
};
