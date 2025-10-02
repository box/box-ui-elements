import type { HttpHandler } from 'msw';
export declare const multilevelTaxonomyLevels: ({
    display_name: string;
    description: string;
    level: number;
    displayName?: undefined;
} | {
    displayName: string;
    display_name: string;
    level: number;
    description?: undefined;
})[];
export declare const singlelevelTaxonomyLevels: {
    display_name: string;
    description: string;
    level: number;
}[];
export declare const mockMetadataTemplatesWithMultilevelTaxonomy: {
    url: string;
    response: {
        limit: number;
        entries: {
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
                namespace?: undefined;
                taxonomyKey?: undefined;
                levels?: undefined;
                optionsRules?: undefined;
            } | {
                id: string;
                type: string;
                key: string;
                displayName: string;
                hidden: boolean;
                namespace: string;
                taxonomyKey: string;
                levels: ({
                    display_name: string;
                    description: string;
                    level: number;
                    displayName?: undefined;
                } | {
                    displayName: string;
                    display_name: string;
                    level: number;
                    description?: undefined;
                })[];
                optionsRules: {
                    multiSelect: boolean;
                    selectableLevels: number[];
                };
            })[];
        }[];
        next_marker: any;
        prev_marker: any;
    };
};
export declare const mockMetadataTemplatesWithSinglelevelTaxonomy: {
    url: string;
    response: {
        limit: number;
        entries: {
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
                namespace: string;
                taxonomyKey: string;
                optionsRules: {
                    multiSelect: boolean;
                    selectableLevels: number[];
                };
            } | {
                id: string;
                type: string;
                key: string;
                displayName: string;
                hidden: boolean;
                namespace?: undefined;
                taxonomyKey?: undefined;
                optionsRules?: undefined;
            })[];
        }[];
        next_marker: any;
        prev_marker: any;
    };
};
export declare const mockMetadataInstancesWithTaxonomy: {
    url: string;
    response: {
        entries: {
            $id: string;
            $version: number;
            $type: string;
            $parent: string;
            $typeVersion: number;
            $template: string;
            $scope: string;
            $canEdit: boolean;
            anotherAttribute: string;
            singleLevel: {
                displayName: string;
                id: string;
                level: string;
                nodePath: any;
                parentId: any;
            }[];
            multiLevel: {
                displayName: string;
                id: string;
                level: string;
                nodePath: string[];
                parentId: string;
            }[];
        }[];
        limit: number;
    };
};
export declare const mockMultilevelTaxonomyOptions: {
    url: string;
    response: {
        firstLevel: {
            entries: {
                id: string;
                display_name: string;
                level: number;
                ancestors: any[];
                selectable: boolean;
            }[];
            taxonomy_id: string;
        };
        'uk-l1-id': {
            entries: ({
                id: string;
                display_name: string;
                level: number;
                ancestors: string[];
                selectable: boolean;
            } | {
                id: string;
                ancestors: {
                    id: string;
                    display_name: string;
                    level: number;
                }[];
                display_name: string;
                level: number;
                selectable: boolean;
            })[];
            taxonomy_id: string;
        };
        'england-l2-id': {
            entries: {
                id: string;
                ancestors: {
                    id: string;
                    display_name: string;
                    level: number;
                }[];
                display_name: string;
                level: number;
                selectable: boolean;
            }[];
            taxonomy_id: string;
        };
        'japan-l1-id': {
            entries: {
                id: string;
                ancestors: {
                    id: string;
                    display_name: string;
                    level: number;
                }[];
                display_name: string;
                level: number;
                selectable: boolean;
            }[];
            taxonomy_id: string;
        };
        'hokkaido-l2-id': {
            entries: {
                id: string;
                ancestors: {
                    id: string;
                    display_name: string;
                    level: number;
                }[];
                display_name: string;
                level: number;
                selectable: boolean;
            }[];
            taxonomy_id: string;
        };
    };
};
export declare const mockSinglelevelTaxonomyOptions: {
    url: string;
    response: {
        entries: {
            id: string;
            display_name: string;
            level: number;
            ancestors: any[];
            selectable: boolean;
        }[];
        taxonomy_id: string;
    };
};
export declare const mockMultilevelTaxonomy: {
    url: string;
    response: {
        display_name: string;
        id: string;
        key: string;
        levels: ({
            display_name: string;
            description: string;
            level: number;
            displayName?: undefined;
        } | {
            displayName: string;
            display_name: string;
            level: number;
            description?: undefined;
        })[];
        namespace: string;
    };
};
export declare const mockSinglelevelTaxonomy: {
    url: string;
    response: {
        display_name: string;
        id: string;
        key: string;
        levels: {
            display_name: string;
            description: string;
            level: number;
        }[];
        namespace: string;
    };
};
export declare const mockMultilevelTaxonomyNodes: {
    url: string;
    response: {
        id: string;
        ancestors: {
            level: number;
            id: string;
            display_name: string;
        }[];
        display_name: string;
        level: number;
        selectable: boolean;
        parent_id: string;
        node_path: string[];
    };
};
export declare const mockSinglelevelTaxonomyNodes: {
    url: string;
    response: {
        id: string;
        ancestors: any[];
        display_name: string;
        level: number;
        selectable: boolean;
        parent_id: any;
        node_path: any[];
    };
};
export declare const taxonomyMockHandlers: HttpHandler[];
