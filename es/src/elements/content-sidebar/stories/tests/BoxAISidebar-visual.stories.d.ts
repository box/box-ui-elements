import { type StoryObj, type Meta } from '@storybook/react';
import type { HttpHandler } from 'msw';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebar';
export declare const basic: StoryObj<typeof BoxAISidebar>;
declare const meta: Meta<typeof ContentSidebar> & {
    parameters: {
        msw: {
            handlers: HttpHandler[];
        };
    };
};
export default meta;
