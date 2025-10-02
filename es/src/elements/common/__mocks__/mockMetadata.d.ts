declare const mockMetadata: {
    entries: ({
        extension: string;
        metadata: {
            enterprise_0: {
                templateName: {
                    $scope: string;
                    role: string[];
                    $template: string;
                    $parent: string;
                    industry: string;
                    last_contacted_at: string;
                    $version: number;
                };
            };
        };
        name: string;
        created_at: string;
        etag: string;
        id: string;
        type: string;
    } | {
        extension: string;
        metadata: {
            enterprise_0: {
                templateName: {
                    $scope: string;
                    $template: string;
                    $parent: string;
                    $version: number;
                    role?: undefined;
                    industry?: undefined;
                    last_contacted_at?: undefined;
                };
            };
        };
        name: string;
        created_at: string;
        etag: string;
        id: string;
        type: string;
    } | {
        name: string;
        created_at: string;
        etag: string;
        metadata: {
            enterprise_0: {
                templateName: {
                    $scope: string;
                    $template: string;
                    $parent: string;
                    industry: string;
                    $version: number;
                    role?: undefined;
                    last_contacted_at?: undefined;
                };
            };
        };
        id: string;
        type: string;
        extension?: undefined;
    })[];
    limit: number;
};
declare const mockSchema: {
    id: string;
    type: string;
    templateKey: string;
    scope: string;
    displayName: string;
    hidden: boolean;
    copyInstanceOnItemCopy: boolean;
    fields: ({
        id: string;
        type: string;
        key: string;
        displayName: string;
        hidden: boolean;
        description: string;
        options?: undefined;
    } | {
        id: string;
        type: string;
        key: string;
        displayName: string;
        hidden: boolean;
        options: {
            id: string;
            key: string;
        }[];
        description?: undefined;
    } | {
        id: string;
        type: string;
        key: string;
        displayName: string;
        hidden: boolean;
        description?: undefined;
        options?: undefined;
    })[];
};
export { mockMetadata, mockSchema };
