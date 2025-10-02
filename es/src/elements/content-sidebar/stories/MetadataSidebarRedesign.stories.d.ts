import { type StoryObj, Meta } from '@storybook/react';
import type { HttpHandler } from 'msw';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';
declare const meta: Meta<typeof ContentSidebar> & {
    parameters: {
        msw: {
            handlers: HttpHandler[];
        };
    };
};
export default meta;
export declare const Basic: StoryObj<typeof MetadataSidebarRedesign>;
