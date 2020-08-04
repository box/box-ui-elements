// @flow strict
import {
    FIELD_TYPE_DATE,
    FIELD_TYPE_ENUM,
    FIELD_TYPE_FLOAT,
    FIELD_TYPE_MULTISELECT,
    FIELD_TYPE_STRING,
} from '../../features/metadata-instance-fields/constants';
import type { SkillCards } from './skills';

type MetadataFieldType =
    | typeof FIELD_TYPE_DATE
    | typeof FIELD_TYPE_ENUM
    | typeof FIELD_TYPE_FLOAT
    | typeof FIELD_TYPE_MULTISELECT
    | typeof FIELD_TYPE_STRING;

type MetadataTemplateFieldOption = {
    id?: string,
    key: string,
};

type MetadataTemplateField = {
    description?: string,
    displayName: string,
    hidden?: boolean,
    id: string,
    isHidden?: boolean,
    key: string, // V2
    options?: Array<MetadataTemplateFieldOption>, // V3
    type: MetadataFieldType,
};

type MetadataTemplate = {
    displayName?: string,
    fields?: Array<MetadataTemplateField>,
    hidden?: boolean,
    id: string,
    isHidden?: boolean,
    scope: string, // V2
    templateKey: string, // V3
};

type MetadataTemplateSchemaResponse = {
    data?: MetadataTemplate,
};

type MetadataSkillsTemplate = {
    boxSkillsCards?: SkillCards,
};

// $FlowFixMe flow strict doesn't like use of "any"
type MetadataFieldValue = string | number | Array<any>;

type MetadataFields = { [string]: MetadataFieldValue };

type MetadataQueryInstanceTypeField = {
    displayName: string,
    key: string,
    options?: MetadataTemplateFieldOption,
    type: string,
    value: ?MetadataFieldValue,
};

type MetadataQueryInstanceTemplate = {
    fields: Array<MetadataQueryInstanceTypeField>,
    id: string,
};

type MetadataType = {
    enterprise?: MetadataQueryInstanceTemplate,
    global?: MetadataSkillsTemplate,
};

type MetadataCascadePolicy = {
    canEdit?: boolean,
    id?: string,
};

type MetadataCascadingPolicyData = {
    id?: string,
    isEnabled: boolean,
    overwrite: boolean,
};

type MetadataInstance = {
    canEdit: boolean,
    cascadePolicy?: MetadataCascadePolicy,
    data: MetadataFields,
    id: string,
};

type MetadataInstanceV2 = {
    $canEdit: boolean,
    $id: string,
    $parent: string,
    $scope: string,
    $template: string,
    $type: string,
    $typeVersion: number,
    $version: number,
};

type MetadataEditor = {
    hasError?: boolean,
    instance: MetadataInstance,
    isDirty?: boolean,
    template: MetadataTemplate,
};

export type {
    MetadataFieldType,
    MetadataTemplateFieldOption,
    MetadataTemplateField,
    MetadataTemplate,
    MetadataTemplateSchemaResponse,
    MetadataFieldValue,
    MetadataFields,
    MetadataQueryInstanceTypeField,
    MetadataType,
    MetadataCascadePolicy,
    MetadataCascadingPolicyData,
    MetadataInstanceV2,
    MetadataEditor,
};
