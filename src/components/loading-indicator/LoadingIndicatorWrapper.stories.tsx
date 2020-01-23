import * as React from 'react';
import LoadingIndicatorWrapper from './LoadingIndicatorWrapper';
import notes from './LoadingIndicatorWrapper.stories.md';

export const regular = () => (
    <LoadingIndicatorWrapper isLoading>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
            src="//cdn03.boxcdn.net/sites/default/files/homepage/v2/images/hero/run/laptop-screen-1680-v2@1x.mp4"
            width="100%"
        />
    </LoadingIndicatorWrapper>
);

export default {
    title: 'Components|LoadingIndicatorWrapper',
    component: LoadingIndicatorWrapper,
    parameters: {
        notes,
    },
};
