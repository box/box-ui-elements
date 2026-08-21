import { type MetadataTemplate, type MetadataTemplateInstance } from '@box/metadata-editor';
import { type BoxItem } from '../../../common/types/core';
import { type MetadataTemplateIdentity } from './metadataTemplateIdentity';

export const convertTemplateToTemplateInstance = (
    file: BoxItem | null,
    template: MetadataTemplate,
): MetadataTemplateInstance => {
    // `namespace` is present at runtime in MIGRATION/FINAL modes but not yet on
    // the `@box/metadata-editor` MetadataTemplate type.
    const { namespace } = template as MetadataTemplate & MetadataTemplateIdentity;

    return {
        canEdit: !!file.permissions.can_upload,
        displayName: template.displayName,
        hidden: template.hidden,
        id: template.id,
        fields: template.fields,
        scope: template.scope,
        ...(namespace != null && { namespace }),
        templateKey: template.templateKey,
        type: template.type,
    } as MetadataTemplateInstance;
};
