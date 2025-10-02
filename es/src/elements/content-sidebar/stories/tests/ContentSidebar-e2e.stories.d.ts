import type { HttpHandler } from 'msw';
import type { Meta } from '@storybook/react';
import ContentSidebar from '../../ContentSidebar';
export declare const basic: {
    args: {
        fileId: any;
    };
};
export declare const fileVersion: {
    args: {
        fileId: any;
    };
};
declare const meta: Meta<typeof ContentSidebar> & {
    parameters: {
        msw: {
            handlers: HttpHandler[];
        };
    };
};
export default meta;
