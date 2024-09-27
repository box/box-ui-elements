import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Footer from '../Footer';

export default {
    title: 'ContentPicker/Footer',
    component: Footer,
    argTypes: {
        onCancel: { action: 'onCancel' },
        onChoose: { action: 'onChoose' },
        onSelectedClick: { action: 'onSelectedClick' },
    },
} as Meta;

const Template: StoryFn<React.ComponentProps<typeof Footer>> = args => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
    currentCollection: { id: '123', name: 'Folder' },
    hasHitSelectionLimit: false,
    isSingleSelect: false,
    selectedCount: 0,
    selectedItems: [],
    showSelectedButton: true,
};

export const WithSelectedItems = Template.bind({});
WithSelectedItems.args = {
    ...Default.args,
    selectedCount: 3,
    selectedItems: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
    ],
};

export const SingleSelect = Template.bind({});
SingleSelect.args = {
    ...Default.args,
    isSingleSelect: true,
};

export const HitSelectionLimit = Template.bind({});
HitSelectionLimit.args = {
    ...WithSelectedItems.args,
    hasHitSelectionLimit: true,
};

export const CustomActionButtons = Template.bind({});
CustomActionButtons.args = {
    ...Default.args,
    renderCustomActionButtons: ({ onCancel, onChoose, selectedCount }) => (
        <div>
            <button onClick={onCancel}>Custom Cancel</button>
            <button onClick={onChoose} disabled={selectedCount === 0}>
                Custom Choose ({selectedCount})
            </button>
        </div>
    ),
};
