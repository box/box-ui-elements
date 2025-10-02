export declare const annotations: {
    id: string;
    target: {
        shape: {
            height: number;
            width: number;
            x: number;
            y: number;
            type: string;
        };
        type: string;
    };
}[];
export declare const scale = 1;
export declare const rect: {
    type: "rect";
    height: number;
    width: number;
    x: number;
    y: number;
};
export declare const target: {
    id: string;
    location: {
        type: "page";
        value: number;
    };
    shape: {
        type: "rect";
        height: number;
        width: number;
        x: number;
        y: number;
    };
    type: "region";
};
export declare const user: {
    id: string;
    login: string;
    name: string;
    type: "user";
};
export declare const annotation: {
    created_at: string;
    created_by: {
        id: string;
        login: string;
        name: string;
        type: "user";
    };
    description: {
        message: string;
        type: "reply";
    };
    file_version: {
        id: string;
        type: "file_version";
    };
    id: string;
    modified_at: string;
    modified_by: {
        id: string;
        login: string;
        name: string;
        type: "user";
    };
    permissions: {
        can_delete: boolean;
        can_edit: boolean;
    };
    target: {
        id: string;
        location: {
            type: "page";
            value: number;
        };
        shape: {
            type: "rect";
            height: number;
            width: number;
            x: number;
            y: number;
        };
        type: "region";
    };
    type: "annotation";
};
