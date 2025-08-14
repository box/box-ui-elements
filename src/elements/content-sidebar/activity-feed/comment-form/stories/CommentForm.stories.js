// @flow
import * as React from 'react';
import { action } from 'storybook/actions';

import CommentForm, { CommentFormUnwrapped } from '../CommentForm';

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

export const basic = () => (
    <CommentForm
        user={defaultUser}
        file={defaultFile}
        onCancel={action('onCancel')}
        createComment={action('createComment')}
        updateComment={action('updateComment')}
        onSubmit={action('onSubmit')}
        onFocus={action('onFocus')}
        getMentionWithQuery={action('getMentionWithQuery')}
    />
);

export const open = () => (
    <CommentForm
        user={defaultUser}
        file={defaultFile}
        isOpen={true}
        onCancel={action('onCancel')}
        createComment={action('createComment')}
        updateComment={action('updateComment')}
        onSubmit={action('onSubmit')}
        onFocus={action('onFocus')}
        getMentionWithQuery={action('getMentionWithQuery')}
    />
);

export const editing = () => (
    <CommentForm
        user={defaultUser}
        file={defaultFile}
        isOpen={true}
        isEditing={true}
        entityId="comment_123"
        tagged_message="This is an existing comment"
        onCancel={action('onCancel')}
        createComment={action('createComment')}
        updateComment={action('updateComment')}
        onSubmit={action('onSubmit')}
        onFocus={action('onFocus')}
        getMentionWithQuery={action('getMentionWithQuery')}
    />
);

export const disabled = () => (
    <CommentForm
        user={defaultUser}
        file={defaultFile}
        isOpen={true}
        isDisabled={true}
        onCancel={action('onCancel')}
        createComment={action('createComment')}
        updateComment={action('updateComment')}
        onSubmit={action('onSubmit')}
        onFocus={action('onFocus')}
        getMentionWithQuery={action('getMentionWithQuery')}
    />
);

export const VideoFile = () => {
    const features = {
        activityFeed: {
            timeStampedComments: {
                enabled: true,
            },
        },
    };

    return (
        <div>
            <div className="bp-media-dash">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                    src="//cdn03.boxcdn.net/sites/default/files/homepage/v2/images/hero/run/laptop-screen-1680-v2@1x.mp4"
                    width="200px"
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
};
