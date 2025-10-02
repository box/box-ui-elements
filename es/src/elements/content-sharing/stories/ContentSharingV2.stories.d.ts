import * as React from 'react';
import ContentSharingV2 from '../ContentSharingV2';
export declare const basic: {};
export declare const withSharedLink: {
    args: {
        api: any;
    };
};
declare const _default: {
    title: string;
    component: typeof ContentSharingV2;
    args: {
        api: any;
        children: React.JSX.Element;
        itemType: any;
        itemID: string;
    };
    argTypes: {
        itemType: {
            options: any[];
            control: {
                type: string;
            };
        };
    };
    parameters: {
        chromatic: {
            disableSnapshot: boolean;
        };
    };
};
export default _default;
