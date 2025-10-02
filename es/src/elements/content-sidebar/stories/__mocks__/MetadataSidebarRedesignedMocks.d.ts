export declare const fileIdWithMetadata = "415542803939";
export declare const fileIdWithoutMetadata = "416047501580";
export declare const mockFileRequest: {
    url: string;
    response: {
        type: string;
        id: string;
        etag: string;
        is_externally_owned: boolean;
        extension: string;
        permissions: {
            can_download: boolean;
            can_preview: boolean;
            can_upload: boolean;
            can_comment: boolean;
            can_rename: boolean;
            can_delete: boolean;
            can_share: boolean;
            can_set_share_access: boolean;
            can_invite_collaborator: boolean;
            can_annotate: boolean;
            can_view_annotations_all: boolean;
            can_view_annotations_self: boolean;
            can_create_annotations: boolean;
            can_view_annotations: boolean;
        };
    };
};
export declare const mockFileRequestWithoutMetadata: {
    url: string;
    response: {
        type: string;
        id: string;
        etag: string;
        is_externally_owned: boolean;
        permissions: {
            can_download: boolean;
            can_preview: boolean;
            can_upload: boolean;
            can_comment: boolean;
            can_rename: boolean;
            can_delete: boolean;
            can_share: boolean;
            can_set_share_access: boolean;
            can_invite_collaborator: boolean;
            can_annotate: boolean;
            can_view_annotations_all: boolean;
            can_view_annotations_self: boolean;
            can_create_annotations: boolean;
            can_view_annotations: boolean;
        };
    };
};
export declare const mockGlobalMetadataTemplates: {
    url: string;
    response: {
        entries: any[];
    };
};
export declare const mockEmptyMetadataInstances: {
    url: string;
    response: {
        entries: {
            id: string;
            $version: number;
            $type: string;
            $parent: string;
            $typeVersion: number;
            $template: string;
            $scope: string;
            myAttribute: string;
            $canEdit: boolean;
        }[];
    };
};
export declare const mockMetadataInstances: {
    url: string;
    response: {
        entries: ({
            $id: string;
            $version: number;
            $type: string;
            $parent: string;
            $typeVersion: number;
            $template: string;
            $scope: string;
            $templateKey: string;
            myAttribute: string;
            $canEdit: boolean;
            Test?: undefined;
            Key?: undefined;
        } | {
            $id: string;
            $version: number;
            $type: string;
            $parent: string;
            $typeVersion: number;
            $template: string;
            $scope: string;
            $canEdit: boolean;
            $templateKey?: undefined;
            myAttribute?: undefined;
            Test?: undefined;
            Key?: undefined;
        } | {
            $id: string;
            $version: number;
            $type: string;
            $parent: string;
            $typeVersion: number;
            $template: string;
            $scope: string;
            Test: string;
            Key: string;
            $canEdit: boolean;
            $templateKey?: undefined;
            myAttribute?: undefined;
        })[];
        limit: number;
    };
};
export declare const mockEnterpriseMetadataTemplates: {
    url: string;
    response: {
        limit: number;
        entries: ({
            id: string;
            type: string;
            templateKey: string;
            scope: string;
            displayName: string;
            hidden: boolean;
            copyInstanceOnItemCopy: boolean;
            fields: {
                id: string;
                type: string;
                key: string;
                displayName: string;
                hidden: boolean;
                description: string;
            }[];
        } | {
            id: string;
            type: string;
            templateKey: string;
            scope: string;
            displayName: string;
            hidden: boolean;
            copyInstanceOnItemCopy: boolean;
            fields: {
                id: string;
                type: string;
                key: string;
                displayName: string;
                hidden: boolean;
                options: {
                    id: string;
                    key: string;
                    staticConfig: {
                        classification: {
                            classificationDefinition: string;
                        };
                    };
                }[];
            }[];
        } | {
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
                options: {
                    id: string;
                    key: string;
                }[];
            } | {
                id: string;
                type: string;
                key: string;
                displayName: string;
                hidden: boolean;
                options?: undefined;
            })[];
        })[];
        next_marker: any;
        prev_marker: any;
    };
};
export declare const mockUpdateCustomMetadataRequest: {
    url: string;
    response: {
        $id: string;
        $version: number;
        $type: string;
        $parent: string;
        $typeVersion: number;
        $template: string;
        $scope: string;
        dsadsa: string;
        $canEdit: boolean;
    };
};
export declare const aiSuggestionsForMyAttribute: {
    url: string;
    response: {
        myAttribute: string;
    };
};
export declare const aiSuggestionForDateField: {
    url: string;
    response: {
        dateField: string;
    };
};
export declare const mockErrorDeleteMyTemplateMetadataRequest: {
    url: string;
    response: {
        message: string;
        code: string;
        request_id: string;
    };
};
