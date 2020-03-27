import * as React from 'react';

import Button from '../button/Button';

import Collapsible from './Collapsible';
import notes from './Collapsible.stories.md';

export const withBorder = () => {
    const onOpen = (arg?: boolean | string | number) => {
        // eslint-disable-next-line no-console
        console.log('opened', arg);
    };
    const onClose = (arg?: boolean | string | number) => {
        // eslint-disable-next-line no-console
        console.log('closed', arg);
    };
    return (
        <Collapsible isOpen onOpen={onOpen} onClose={onClose} isBordered title="Collapsible card title">
            <div>This is content of a collapsible component</div>
            <div>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&rsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </div>
        </Collapsible>
    );
};

export const withoutBorder = () => (
    <Collapsible isOpen title="Collapsible card title">
        <div>This is content of a collapsible component</div>
        <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry&rsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
        </div>
    </Collapsible>
);

export const withButtonInHeader = () => (
    <Collapsible
        headerActionItems={<Button className="collapsible-card-action-items">Click Here</Button>}
        isBordered
        isOpen
        title="Collapsible card title"
    >
        <div>This is content of a collapsible component</div>
        <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry&rsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
        </div>
    </Collapsible>
);

export default {
    title: 'Components|Collapsible',
    component: Collapsible,
    parameters: {
        notes,
    },
};
