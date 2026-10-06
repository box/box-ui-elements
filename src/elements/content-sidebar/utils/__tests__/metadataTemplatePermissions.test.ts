import { canCreateTemplatesInNamespace, canEditMetadataTemplate } from '../metadataTemplatePermissions';

const templatePermissions = {
    can_read: false,
    can_update: false,
    can_delete: false,
    can_view_permissions: false,
    can_manage_permissions: false,
};

const namespacePermissions = {
    ...templatePermissions,
    can_create_namespaces: false,
    can_create_templates: false,
};

describe('metadataTemplatePermissions', () => {
    test('should allow template creation only when every namespace flag is boolean and can_create_templates is true', () => {
        expect(
            canCreateTemplatesInNamespace({
                permissions: { ...namespacePermissions, can_create_templates: true },
            }),
        ).toBe(true);
    });

    test('should deny template creation when the grant is false, missing, or incomplete', () => {
        expect(canCreateTemplatesInNamespace({ permissions: namespacePermissions })).toBe(false);
        expect(canCreateTemplatesInNamespace({ permissions: null })).toBe(false);
        expect(canCreateTemplatesInNamespace({})).toBe(false);
        expect(canCreateTemplatesInNamespace(null)).toBe(false);
        expect(
            canCreateTemplatesInNamespace({
                permissions: { ...namespacePermissions, can_create_templates: null },
            }),
        ).toBe(false);
        expect(
            canCreateTemplatesInNamespace({
                allowedOperations: ['CREATE_NAMESPACE_TEMPLATES'],
            }),
        ).toBe(false);
    });

    test('should allow template edit only when every template flag is boolean and can_update is true', () => {
        expect(canEditMetadataTemplate({ permissions: { ...templatePermissions, can_update: true } })).toBe(true);
    });

    test('should deny template edit when the grant is false, missing, or incomplete', () => {
        expect(canEditMetadataTemplate({ permissions: templatePermissions })).toBe(false);
        expect(canEditMetadataTemplate({ permissions: { can_update: true } })).toBe(false);
        expect(canEditMetadataTemplate({ permissions: null })).toBe(false);
        expect(canEditMetadataTemplate({ canEdit: true })).toBe(false);
        expect(canEditMetadataTemplate({ allowedOperations: ['UPDATE_TEMPLATE'] })).toBe(false);
        expect(canEditMetadataTemplate(undefined)).toBe(false);
    });
});
