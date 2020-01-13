// @flow
import * as React from 'react';

import Avatar from './Avatar';
import notes from './Avatar.stories.md';

export const regular = () => <Avatar id={1} name="Aaron Levie" />;

export const withAvatarUrl = () => (
    <Avatar
        id={1}
        name="Aaron Levie"
        avatarUrl="https://pbs.twimg.com/profile_images/885529357904510976/tM0vLiYS_400x400.jpg"
    />
);

export const withUrlFallbackToInitials = () => (
    <Avatar
        id={1}
        name="Aaron Levie"
        avatarUrl="https://pbs.twimg.com/profile_images/885529357904510976/tM0vLiYS_400x400.jpg_invalid"
    />
);

export const withMultipleAvatars = () => (
    <div>
        <Avatar id={1} name="Aaron Levie" />
        <Avatar id={2} name="Front End" />
        <Avatar id={3} name="Redwood City" />
    </div>
);

export const withoutNameOrInitials = () => <Avatar />;

export default {
    title: 'Components|Avatar',
    component: Avatar,
    parameters: {
        notes,
    },
};
