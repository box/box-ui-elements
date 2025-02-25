import * as React from 'react';

import GuideTooltip from './GuideTooltip';
import Button, { ButtonType } from '../button/Button';
import FolderShared32 from '../../icon/content/FolderShared32';
import notes from './GuideTooltip.stories.md';
// @ts-ignore flow import
import testImageSrc from './test-image.png';

const addSpacing = (component: React.ReactElement) => <div style={{ textAlign: 'center' }}>{component}</div>;

export const allOptionsWithIcon = () =>
    addSpacing(
        <GuideTooltip
            title="Lorem Ipsum"
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            icon={<FolderShared32 />}
            steps={[1, 3]}
            /* eslint-disable no-console */
            primaryButtonProps={{
                children: 'Next',
                onClick: () => console.log('next'),
                className: '',
                isLoading: false,
                showRadar: false,
                type: ButtonType.BUTTON,
            }}
            secondaryButtonProps={{
                children: 'Back',
                onClick: () => console.log('back'),
                className: '',
                isLoading: false,
                showRadar: false,
                type: ButtonType.BUTTON,
            }}
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
            title="Lorem Ipsum"
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            image={<img src={testImageSrc} alt="Lorem ipsum dolor" />}
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
            title="Lorem Ipsum"
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            icon={<FolderShared32 />}
            steps={[1, 3]}
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
            title="Lorem Ipsum"
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
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
    title: 'Components/GuideTooltip',
    component: GuideTooltip,
    parameters: {
        notes,
    },
};
