import * as React from 'react';

import GuideTooltip from './GuideTooltip';
import Button from '../button/Button';
import FolderShared32 from '../../icon/content/FolderShared32';
import notes from './GuideTooltip.stories.md';
// @ts-ignore flow import
import testImageSrc from './test-image.png';

const addSpacing = (component: JSX.Element) => <div style={{ textAlign: 'center' }}>{component}</div>;

export const allOptionsWithIcon = () =>
    addSpacing(
        <GuideTooltip
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            icon={<FolderShared32 />}
            /* eslint-disable no-console */
            primaryButtonProps={{ children: 'Next', onClick: () => console.log('next') }}
            secondaryButtonProps={{ children: 'Back', onClick: () => console.log('back') }}
            steps={[1, 3]}
            title="Lorem Ipsum"
            /* eslint-enable no-console */
        >
            <Button>example</Button>
        </GuideTooltip>,
    );

allOptionsWithIcon.story = {
    name: 'body, icon, steps, title, next button, previous button',
};

export const titleImageBody = () =>
    addSpacing(
        <GuideTooltip
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            image={<img alt="Lorem ipsum dolor" src={testImageSrc} />}
            title="Lorem Ipsum"
        >
            <Button>example</Button>
        </GuideTooltip>,
    );

titleImageBody.story = {
    name: 'title, image, body',
};

export const noButtons = () =>
    addSpacing(
        <GuideTooltip
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            icon={<FolderShared32 />}
            steps={[1, 3]}
            title="Lorem Ipsum"
        >
            <Button>example</Button>
        </GuideTooltip>,
    );

noButtons.story = {
    name: 'body, icon, steps, title',
};

export const onlyTitleBody = () =>
    addSpacing(
        <GuideTooltip
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            title="Lorem Ipsum"
        >
            <Button>example</Button>
        </GuideTooltip>,
    );

onlyTitleBody.story = {
    name: 'only title and body',
};

export const onlyBody = () =>
    addSpacing(
        <GuideTooltip body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
            <Button>example</Button>
        </GuideTooltip>,
    );

onlyBody.story = {
    name: 'only body',
};

export default {
    title: 'Components|GuideTooltip',
    component: GuideTooltip,
    parameters: {
        notes,
    },
};
