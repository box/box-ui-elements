import {
    getEnterpriseNamespaceFromInstances,
    getEnterpriseRootFromScopeOrNamespace,
    isTemplateExternallyOwned,
    resolveMetadataNamespaceMode,
    resolveScopeOrNamespace,
} from '../metadataNamespaceUtils';
import {
    METADATA_NAMESPACE_GLOBAL,
    METADATA_SCOPE_MODE_FINAL,
    METADATA_SCOPE_MODE_MIGRATION,
    METADATA_SCOPE_MODE_SCOPED,
} from '../../constants';

describe('api/metadataNamespaceUtils', () => {
    describe('getEnterpriseRootFromScopeOrNamespace()', () => {
        test('should prefer scope when present', () => {
            expect(getEnterpriseRootFromScopeOrNamespace('enterprise_999', 'enterprise_123.legal')).toBe(
                'enterprise_999',
            );
        });

        test('should extract root from dot-delimited namespace', () => {
            expect(getEnterpriseRootFromScopeOrNamespace(undefined, 'enterprise_123.legal')).toBe('enterprise_123');
        });

        test('should return null when neither is an enterprise value', () => {
            expect(getEnterpriseRootFromScopeOrNamespace('global', 'box.metadata')).toBeNull();
        });
    });

    describe('getEnterpriseNamespaceFromInstances()', () => {
        test('should return the first enterprise root found', () => {
            expect(
                getEnterpriseNamespaceFromInstances([{ $scope: 'global' }, { $namespace: 'enterprise_123.legal' }]),
            ).toBe('enterprise_123');
        });
    });

    describe('resolveMetadataNamespaceMode()', () => {
        test.each`
            isMigration | isFinal  | expected
            ${false}    | ${false} | ${METADATA_SCOPE_MODE_SCOPED}
            ${true}     | ${false} | ${METADATA_SCOPE_MODE_MIGRATION}
            ${true}     | ${true}  | ${METADATA_SCOPE_MODE_FINAL}
            ${false}    | ${true}  | ${METADATA_SCOPE_MODE_FINAL}
        `('should resolve $expected', ({ isMigration, isFinal, expected }) => {
            expect(resolveMetadataNamespaceMode(isMigration, isFinal)).toBe(expected);
        });
    });

    describe('resolveScopeOrNamespace()', () => {
        test('should map global to box.metadata in FINAL mode', () => {
            expect(resolveScopeOrNamespace(METADATA_SCOPE_MODE_FINAL, 'global')).toBe(METADATA_NAMESPACE_GLOBAL);
        });

        test('should prefer namespace when scope is absent', () => {
            expect(resolveScopeOrNamespace(METADATA_SCOPE_MODE_MIGRATION, undefined, 'enterprise_123.legal')).toBe(
                'enterprise_123.legal',
            );
        });
    });

    describe('isTemplateExternallyOwned()', () => {
        test('should compare enterprise roots when viewer FQN is known', () => {
            expect(isTemplateExternallyOwned('enterprise_999', 'enterprise_123', false)).toBe(true);
            expect(isTemplateExternallyOwned('enterprise_123', 'enterprise_123', false)).toBe(false);
        });

        test('should fall back to scoped-miss legacy behaviour without viewer FQN', () => {
            expect(isTemplateExternallyOwned('enterprise_999', undefined, true)).toBe(true);
            expect(isTemplateExternallyOwned('enterprise_123', undefined, false)).toBe(false);
        });
    });
});
