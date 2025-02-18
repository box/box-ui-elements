import { type MetadataTemplate, type MetadataTemplateInstance } from '@box/metadata-editor';
import { convertTemplateToTemplateInstance } from '../utils/convertTemplateToTemplateInstance';
import { type BoxItem } from '../../../common/types/core';

describe('convertTemplateToTemplateInstance', () => {
    it('should correctly convert template to template instance', () => {
        const mockFile: BoxItem = {
            id: '123',
            type: 'file',
            permissions: {
                can_upload: true,
            },
        };
        const mockTemplate: MetadataTemplate = {
            displayName: 'Test Template',
            hidden: false,
            id: '123',
            fields: [],
            scope: 'global',
            templateKey: 'test_template',
            type: 'metadata_template',
        };

        const mockTemplateInstance: MetadataTemplateInstance = {
            canEdit: true,
            displayName: 'Test Template',
            hidden: false,
            id: '123',
            fields: [],
            scope: 'global',
            templateKey: 'test_template',
            type: 'metadata_template',
        };

        const result = convertTemplateToTemplateInstance(mockFile, mockTemplate);

        expect(result.canEdit).toBe(mockTemplateInstance.canEdit);
        expect(result.displayName).toBe(mockTemplateInstance.displayName);
        expect(result.hidden).toBe(mockTemplateInstance.hidden);
        expect(result.fields).toEqual(mockTemplateInstance.fields);
        expect(result.id).toEqual(mockTemplateInstance.id);
        expect(result.scope).toBe(mockTemplateInstance.scope);
        expect(result.templateKey).toBe(mockTemplateInstance.templateKey);
        expect(result.type).toBe(mockTemplateInstance.type);
    });
});
