import { type MetadataTemplate, type MetadataTemplateInstance } from '@box/metadata-editor';
import { type BoxItem } from '../../../common/types/core';

export const convertTemplateToTemplateInstance = (
    file: BoxItem | null,
    template: MetadataTemplate,
): MetadataTemplateInstance => {
    return {
        canEdit: !!file.permissions.can_upload,
        displayName: template.displayName,
        hidden: template.hidden,
        id: template.id,
        fields: template.fields,
        scope: template.scope,
        templateKey: template.templateKey,
        type: template.type,
    };
};
